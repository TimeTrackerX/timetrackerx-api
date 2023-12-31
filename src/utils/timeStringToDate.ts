export const timeStringToDate = (time: string): Date => {
    const [hour, minute, second] = time.split(':');
    const date = new Date();
    date.setHours(Number(hour), Number(minute), Number(second));
    return date;
};
