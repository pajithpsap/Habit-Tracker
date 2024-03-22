// controllers/homeController.js
const moment = require("moment");
const Habit = require("../models/TrackerModel");
class HomeController {
  async getHomePage(req, res) {
    try {
      // Get all habits
      const habits = await Habit.find();

      // Populate tracking details for the current week
      const currentDate = new Date();
      const weekStart = new Date(currentDate);
      weekStart.setDate(currentDate.getDate() - currentDate.getDay()); // Get start of the week (Sunday)
      const weekEnd = new Date(currentDate);
      weekEnd.setDate(currentDate.getDate() + (6 - currentDate.getDay())); // Get end of the week (Saturday)

      // Populate tracking details for the current week
      const populatedHabits = await Habit.populate(habits, {
        path: "tracking",
        match: {
          createdAt: { $gte: weekStart, $lte: weekEnd },
        },
      });

      res.render("in", { habits: populatedHabits });
    } catch (error) {
      console.error("Error fetching habits:", error);
      res.status(500).json({ error: "Failed to fetch habits" });
    }
  }

  async addHabit(req, res) {
    const { habitName } = req.body;

    try {
      if (!habitName || habitName.trim() === "") {
        return res.status(400).json({ error: "Habit name is required" });
      }

      const habit = new Habit({ name: habitName });
      await habit.save();
      res.redirect("/");
    } catch (error) {
      console.error("Error adding habit:", error);
      res.status(500).json({ error: "Failed to add habit" });
    }
  }

  // Controller function to update a habit's tracking detail
  async updateHabit(req, res) {
    const { id } = req.params;
    const { dayIndex, done, date } = req.body;
    const strDate = date;
    try {
        const trackingDate = moment(date, "MM/DD/YYYY").toDate();
        trackingDate.setDate(trackingDate.getDate() + 1);
        console.log(trackingDate);
        const habit = await Habit.findById(id);

        if (!habit) {
            return res.status(404).json({ message: "Habit not found" });
        }

        // Check if there is an existing tracking entry for the specified date
        const existingTracking = habit.tracking.find(tracking => {
            return moment(tracking.date).isSame(trackingDate, 'day');
        });

        if (existingTracking) {
            // Update the existing tracking entry
            existingTracking.done = done;
        } else {
            // Create a new tracking entry if none exists
            habit.tracking.push({ date: trackingDate, done, dateString: strDate });
        }

        // Save the updated habit to the database
        await habit.save();
        res.json({ message: 'Habit updated successfully', habit });
       //console.log("Redirecting to homepage");
       //return res.redirect("/");
    } catch (error) {
        console.error("Error updating habit:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}



  // Controller function to delete a habit
  async deleteHabit(req, res) {
    const { id } = req.params;

    try {
      const habit = await Habit.findByIdAndDelete(id);
      if (!habit) {
        return res.status(404).json({ error: "Habit not found" });
      }

      res.json({ message: "Habit deleted successfully" });
     // res.redirect("/");
    } catch (error) {
      console.error("Error deleting habit:", error);
      res.status(500).json({ error: "Failed to delete habit" });
    }
  }
}
module.exports = HomeController;
