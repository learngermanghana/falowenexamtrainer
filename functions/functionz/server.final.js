const express = require("express");
const app = require("./app");
const { createFinalAttendanceCheckinRouter } = require("./routes/finalAttendanceCheckin");

const wrapper = express();
const finalAttendanceCheckinRouter = createFinalAttendanceCheckinRouter();

wrapper.use(finalAttendanceCheckinRouter);
wrapper.use("/api", finalAttendanceCheckinRouter);
wrapper.use(app);
wrapper.use("/api", app);

const port = process.env.PORT || 5000;

if (require.main === module) {
  wrapper.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Falowen functions API listening on http://localhost:${port}`);
  });
}

module.exports = wrapper;
