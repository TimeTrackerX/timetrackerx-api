export const timeStringToDate = (time: string): Date => {
    if (!/^\d{2}:\d{2}:\d{2}$/.test(time)) {
        throw new Error('Invalid time format. Expected HH:mm:ss');
    }
    const [hour, minute, second] = time.split(':');
    const date = new Date();
    date.setHours(Number(hour), Number(minute), Number(second));
    return date;
};
