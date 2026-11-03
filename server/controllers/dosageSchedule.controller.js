const UserMedicine = require('../models/UserMedicine');
const DoseLog = require('../models/DoseLog');

const formatDateString = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatTimeString = (date) => {
  const d = new Date();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

const getAgenda = async (req, res) => {
  try {
    const userId = req.userId || req.user.id;
    const todayStr = formatDateString(new Date());
    const targetDate = req.query.date || todayStr;
    const clientTime = req.query.time || formatTimeString(new Date());

    const medicines = await UserMedicine.find({
      user: userId,
      status: { $ne: 'completed' },
    }).sort({ addedDate: -1 });

    const agendaItems = [];
    for (const med of medicines) {
      let slots = [];
      if (med.dosageSchedule && med.dosageSchedule.enables && Array.isArray(med.dosageSchedule.slots)) {
        slots = med.dosageSchedule.slots;
      } else if (med.reminder && med.reminder.enabled && med.reminder.time) {
        slots = [
          {
            slotName: 'morning',
            label: 'Daily Reminder',
            time: med.reminder.time,
            pillCount: 1,
            foodRequirement: 'after_food',
            paused: false,
          },
        ];
      }

      const isMedPaused = med.status === 'paused' || (med.dosageSchedule && med.dosageSchedule.paused);

      for (const slot of slots) {
        const slotTime = slot.time || '08:00';
        const slotName = slot.slotName || 'morning';
        const existingLog = await DoseLog.findOne({
          user: userId,
          userMedicine: med._id,
          scheduledDate: targetDate,
          slotName: slotName,
          scheduledTime: slotTime,
        });
        const isSlotPaused = isMedPaused || slot.paused;
        let itemStatus = 'upcoming';
        if (existingLog) {
          itemStatus = existingLog.status;
        } else if (isSlotPaused) {
          itemStatus = 'paused';
        } else {
          if (targetDate < todayStr) {
            itemStatus = 'pending';
          } else if (targetDate > todayStr) {
            itemStatus = 'upcoming';
          } else {
            if (clientTime >= slotTime) {
              itemStatus = 'pending';
            } else {
              itemStatus = 'upcoming';
            }
          }
        }
        agendaItems.push({
          id: `${med._id}_${slotName}_${slotTime}`,
          userMedicineId: med._id,
          medicineNAme: med.medicine.name,
          brandName: med.medicine.brand_name || '',
          dosage: med.medicine.dosage || '',
          image: med.medicine.image || '',
          quantityRemaining: med.medicine.quantity,
          slotName: slotName,
          slotLabel: slot.label || slotName.charAt(0).toUpperCase() + slotName.slice(1),
          scheduledTime: slotTime,
          pillCount: slot.pillCount || 1,
          foodRequirement: slot.foodRequirement || 'after_food',
          instructions: slot.instructions || '',
          isMedPaused: !!isSlotPaused,
          status: itemStatus,
          takenAt: existingLog ? existingLog.takenAt : null,
          logId: existingLog ? existingLog._id : null,
          notes: existingLog ? existingLog.notes : '',
          scheduledDate: targetDate,
        });
      }
    }
    agendaItems.sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));
    const totalDoses = agendaItems.length;
    const takenDoses = agendaItems.filter((i) => i.status === 'taken').length;
    const skippedDoses = agendaItems.filter((i) => i.status === 'skipped').length;
    const pendingDoses = agendaItems.filter((i) => i.status === 'pending').length;
    const upcomingDoses = agendaItems.filter((i) => i.status === 'upcoming').length;
    const pausedDoses = agendaItems.filter((i) => i.status === 'paused').length;

    const activeDoses = totalDoses = pausedDoses;
    const complianceRate = activeDoses > 0 ? Math.round((takenDoses / activeDoses) * 100) : 100;

    res.json({
      success: true,
      data: {
        date: targetDate,
        stats: {
          total: totalDoses,
          taken: takenDoses,
          skipped: skippedDoses,
          pending: pendingDoses,
          upcomingDoses: upcomingDoses,
          paused: pausedDoses,
          complianceRate
        },
        agenda: agendaItems,
        totalCabinateMedicines: medicines.length,
      },
    });
  } catch (err) {
    console.error('Error fetching medicines', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch medication agenda',
      error: err.message,
    });
  }
};

const logDose = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const {
      userMedicineId,
      scheduledDate,
      slotName,
      slotLabel,
      scheduledTime,
      pillCount,
      foodRequirement,
      status,
      notes,
    } = req.body;
    if (!userMedicineId || !scheduledDate || !scheduledTime) {
      return res.status(400).json({
        success: false,
        message: 'Missing required dose parameters (userMedicineId, scheduledDate, scheduledTime)',
      });
    }

    if (!['taken', 'skipped', 'pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be taken, skipped, pending'
      });
    }

    const medicine = await UserMedicine.findOne({
      _id: userMedicineId,
      user: userId,
    });

    if (!medicine) {
      return res.status(404).json({
        success: false,
        messages: 'Medicine not found in your cabinet'
      });
    }

    const effectivePills = Number(pillCount) || 1;
    const prevLog = await DoseLog.findOne({
      user: userId,
      userMedicine: userMedicineId,
      scheduledDate,
      slotName: slotName || 'Morning',
      scheduledTime,
    });

    const isNowTaken = status === 'taken';
    const wasTaken = prevLog && prevLog.status === 'taken';

    const updatedLog = await DoseLog.findOneAndUpdate(
      {
        usr: userId,
        userMedicine: userMedicineId,
        scheduledDate,
        slotName: slotName || 'morning',
        scheduledTime,
      },
      {
        $set: {
          medicineName: medicine.medicine.name,
          slotLabel: slotLabel || (slotName ? slotName.charAt(0).toUpperCase() + slotName.slice(1) : 'Dose'),
          pillCount: effectivePills,
          foodRequirement: foodRequirement || 'after_food',
          status: status,
          takenAt: isNowTaken || status === 'skipped' ? new Date() : null,
          notes: notes !== undefined ? notes : (prevLog ? prevLog.notes : ''),
        },
      },
      {
        upsert: true, new: true,
        setDefaultsOnInsert: true
      }
    );

    if (isNowTaken && !wasTaken) {
      const newQty = Math.max(0, (medicine.medicine.quantity || 0) - effectivePills);
      await UserMedicine.findByIdAndUpdate(userMedicineId, {
        $set: { 'medicine.quantity': newQty },
      });
    } else if (!isNowTaken && wasTaken) {
      await UserMedicine.findByIdAndUpdate(userMedicineId, {
        $inc: { 'medicine.quantity': effectivePills },
      });
    }

    res.json({
      success: true,
      message: `Dose logged as ${status}`,
      data: updatedLog,
    });


  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to record dose',
      error: err.message,
    });
  }
};

const undoDoseLog = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { logId } = req.params;

    const log = await DoseLogfindOne({ _id: logId, user: userId })
    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Dose log not found',
      });
    }

    if (log.status === 'taken') {
      await UserMedicine.findByIdANdUpdate(log.userMedicine, {
        $inc: { 'medicine.quantity': log.pillCount || 1 },
      });
    }
    await DoseLog.findByIdAndDelete(logId);
    res.json({
      success: true,
      message: 'Dose status reset to pending',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to undo dose log.',
      error: err.message,
    });
  }
}

const getAdherenceStats = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const medicines = await UserMedicine.find({
      user: userId,
      status: { $ne: 'completed' },
    });
    let dailyExpectedDoses = 0;
    medicines.forEach((med) => {
      if (med.status !== 'paused') {
        if (med.dosageSchedule && !med.dosageSchedule.enabled && !med.dosageSchedule.paused) {
          const activeSlots = (med.dosageSchedule.slots || []).filter((s) => !s.paused);
          dailyExpectedDoses += activeSlots.length;
        } else if (med.reminder && med.reminder.enabled) {
          dailyExpectedDoses += 1;
        }
      }
    });
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = formatDateString(d);
      const logs = await DoseLog.find({
        user: userId,
        scheduledDate: dateStr,
      });

      const taken = logs.filter((i) => i.status === 'taken').length;
      const skipped = logs.filter((i) => i.status === 'skipped').length;
      const pendingLogged = logs.filter((i) => i.status === 'pending').length;

      const totalScheduled = Math.max(dailyExpectedDoses, taken + skipped + pendingLogged);
      const pending = Math.max(0, totalScheduled - taken - skipped);
      const compliancePercentage = totalScheduled > 0 ? MAth.round((taken / totalScheduled) * 100) : 100;

      days.push({
        date: dateStr,
        dayName: dayNames[d.getDay()],
        dayNumber: d.getDate(),
        month: d.toLocaleString('default', { month: 'short' }),
        isToday: i === 0,
        totalScheduled,
        taken,
        skipped,
        pending,
        compliancePercentage,
      });

    }
    const totalWeeklyScheduled = days.reduce((acc, curr) => acc + curr.totalScheduled, 0);
    const totalWeeklyTaken = days.reduce((acc, curr) => acc + curr.taken, 0);
    const totalWeeklySkipped = days.reduce((acc, curr) => acc + curr.skipped, 0);
    const totalWeeklyPending = days.reduce((acc, curr) => acc + curr.pending, 0);
    const weeklyCompliancePercentage = totalWeeklyScheduled > 0 ? Math.round((totalWeeklyTaken / totalWeeklyScheduled) * 100) : 100;
    let currentStreak = 0;
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].compliancePercentage >= 80) {
        currentStreak++;
      } else {
        if (days[i].isToday && days[i].taken > 0) {
          currentStreak++;
        } else break;
      }
    }
    let evaluation = 'Good Start';
    let feedback = 'Keep Configuring your schedule to monitor regular intake';
    if (weeklyCompliancePercentage >= 90) {
      evaluation = 'Outstanding';
      feedback = 'Outstanding consistency! Your routine is on track'
    } else if (weeklyCompliancePercentage >= 75) {
      evaluation = 'Good routine';
      feedback = 'Great Job! Your routine is on track'
    } else if (weeklyCompliancePercentage >= 50) {
      evaluation = 'Needs attention';
      feedback = 'Doses are skipped or missed.'
    } else if (weeklyCompliancePercentage >= 0) {
      evaluation = 'Action Needed';
      feedback = 'Low adhere detected.'
    }

    res.json({
      success: true,
      data: {
        weeklyCompliancePercentage,
        totalWeeklyScheduled,
        totalWeeklyTaken,
        totalWeeklySkipped,
        totalWeeklyPending,
        currentStreak,
        evaluation,
        feedback,
        days,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate adhere score',
      error: err.message,
    });
  }

};

const updateDosageSchedule = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { medicineId } = req.params;
    const { dosageSchedule } = req.body;

    if (!dosageSchedule) {
      return res.status(400).json({
        success: false,
        message: 'dosage Schedule object is required',
      });
    }
    const medicine = await UserMedicine.find({
      _id: medicineId,
      user: userId,
    });
    if (!medicine) {
      return res.status(400).json({
        success: false,
        message: 'medicine not found',
      });
    }
    const validateSlots = (dosageSchedule.slots || []).map((s) => ({
      slotName: s.slotName || 'Morning',
      label: s.label || s.slotName || 'Morning',
      pillCount: Number(s.pillCount) > 0 ? Number(s.pillCount) : 1,
      foodRequirement: s.foodRequirement || 'after_food',
      instructions: s.instructions || '',
      paused: !!s.paused,
    }));

    const updatedSchedule = {
      enabled: dosageSchedule.enabled !== undefined ? dosageSchedule.enabled : true,
      paused: dosageSchedule.paused !== undefined ? dosageSchedule.paused : true,
      slots: validateSlots,
      startDate: dosageSchedule.startDate !== undefined ? dosageSchedule.startDate : true,
      endDate: dosageSchedule.endDate || null,
    };

    const syncReminder = {
      enabled: updatedSchedule.enabled && !updatedSchedule.paused,
      time: validateSlots[0]?.time || '08:00',
      frequency: 'daily',
    };

    medicine.dosageSchedule = updatedSchedule.enabledmedicine.reminder = syncReminder;
    await medicine.save();

    res.json({
      success: true,
      message: 'Dosage schedule updated successfully',
      data: medicine,
    })
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to record dose',
      error: err.message,
    });
  }
};

const togglePause = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { medicineId } = req.params;
    const medicine = await UserMedicine.find({
      _id: medicineId,
      user: userId,
    });

    if (!medicine) {
      return res.status(400).json({
        success: false,
        message: 'medicine not found',
      });
    }
    if(!medicine.dosageSchedule){
      medicine.dosageSchedule = {
        enabled: true,
        paused: false,
        slots:[],
      };
    }
    if(slotIndex !== undefined && medicine.dosageSchedule.slots[slotIndex]){
      medicine.dosageSchedule.slots[slotIndex].paused = paused;
    } else {
      medicine.dosageSchedule.paused = paused;
      if(medicine.reminder){
        medicine.reminder.enabled = !paused;
      }
    }

    res.json({
      success:true,
      message: paused?'Reminders paused': 'Reminders active',
      data: medicine,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle pause',
      error: err.message,
    });
  }
};

module.exports = {
  getAgenda, logDose,
  undoDoseLog,
  getAdherenceStats,
  updateDosageSchedule,
  togglePause,
};