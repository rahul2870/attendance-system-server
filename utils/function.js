const getUserId = (() => {
    let counter = 0;

    return () => {
        counter++;
        return counter.toString().padStart(4, '0');
    };
})();

const getPhoneNumber = (() => {
    let counter = 0;

    return () => {
        counter++;
        const formattedCounter = counter.toString().padStart(10, '0');
        return `+91-${formattedCounter}`;
    };
})();

module.exports = {
    getUserId,
    getPhoneNumber
}