const { default: mongoose } = require("mongoose");
const { AllUsers } = require("../../utils/db");

const getUser = (req, res) => {
    res.json({ success: true, data: AllUsers, message: "successfully user list fetched!" })
}

const attendanceDynamic = new mongoose.Schema({}, { strict: false });
const attendanceDynamicModel = mongoose.model(
    "attendance",
    attendanceDynamic
);

const makeAttendance = async (req, res) => {

    // Assuming you have already set up your Mongoose connection and attendanceDynamicModel.
    try {
        const { date, user, monthYear } = req.body;

        // Check if a user with the same employeeId is already present for the given date
        const existingAttendance = await attendanceDynamicModel.findOne({ date });

        if (existingAttendance) {
            // Check if the user with the same employeeId exists in the presentUsers array
            const isUserAlreadyPresent = existingAttendance.presentUsers.some(
                presentUser => presentUser.employeeId === user.employeeId
            );

            if (isUserAlreadyPresent) {
                return res.json({ success: false, message: 'Attendance already present' });
            } else {
                await attendanceDynamicModel.updateOne(
                    { date: date },
                    { $addToSet: { presentUsers: user } }
                )
                return res.json({ success: false, message: 'Attendance marked' });
            }
        } else {
            // If there is no entry for the date, create a new one
            const newAttendance = new attendanceDynamicModel({
                date,
                monthYear,
                presentUsers: [user],
            });
            await newAttendance.save();
            return res.json({ message: 'Attendance recorded successfully' });
        }


    } catch (error) {
        console.error(error);
        res.json({ error: 'Internal Server Error' });
    }
};

const getAllAttendanceDayWise = async (req, res) => {
    try {
        const { monthYear } = req.body;
        const aggregationPipeline = [
            {
                $match: {
                    monthYear: 'September 2023'
                },
            },
            {
                $unwind: '$presentUsers', // Deconstruct the presentUsers array
            },
            {
                $group: {
                    _id: '$date',
                    totalPresents: { $sum: 1 }, // Count the number of deconstructed documents (presents)
                },
            },
            {
                $project: {
                    date: '$_id',
                    totalPresents: 1,
                    _id: 0,
                },
            },
        ];


        const attendanceData = await attendanceDynamicModel.aggregate(aggregationPipeline);
        res.json({ success: true, data: attendanceData, message: 'list fetched!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error!' });
    }
}


const getSingleDayList = async (req, res) => {
    try {
        const { date } = req.body;
        const existingAttendance = await attendanceDynamicModel.findOne({ date });
        if (!existingAttendance) {
            return res.json({ success: false, data: null, message: "No Attendance Found!" })
        }
        return res.json({ success: true, data: existingAttendance })
    } catch (error) {
        return res.json({ success: false, data: null, message: "No Attendance Found!" })
    }
}

const makeAbsent = async (req, res) => {
    try {
        const { user, date } = req.body;

        const result = await attendanceDynamicModel.updateOne(
            { date: date },
            [
                {
                    $set: {
                        presentUsers: {
                            $filter: {
                                input: '$presentUsers',
                                as: 'presentUser',
                                cond: { $ne: ['$$presentUser.employeeId', user.employeeId] },
                            },
                        },
                    },
                },
            ]
        );
        if (result.modifiedCount > 0) {
            return res.json({ success: true, message: 'User removed from attendance' });
        } else {
            return res.json({ success: false, message: 'Failed to remove user' });
        }
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: 'Internal Server Error' });
    }
}


module.exports = { getUser, makeAttendance, getAllAttendanceDayWise, getSingleDayList, makeAbsent }
