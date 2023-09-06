const { getUserId, getPhoneNumber } = require("./function")
const userNames = ["Arjun", "Krishna", "Bheem", "Drona", "Dropati", "Ram", "Lakshman", "Ravan", "Nakul", "Karna", "Vasu"]
const getNewUser = (name) => {
    return { employeeId: getUserId(), name, phoneNumber: getPhoneNumber(), }
}

const AllUsers = userNames.map(name => getNewUser(name))


module.exports = {
    AllUsers
}