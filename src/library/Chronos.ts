/**
 * Get the current time based on the timezone, defaults to Japan
 * @param timezone the IANA timezone string
 * @returns the current time (locale string)
 */
export function getCurrentTime(
    timezone: string = "Japan",
    options?: Intl.DateTimeFormatOptions
): string{
    const date = (new Date()).toLocaleString("en-US", {timeZone: timezone, ...options});
    return date;
}

/**
 * Get the current time plus the specified time, this operation is unsafe and does not consider daylight saving time
 * @param timezone the IANA timezone string
 * @param plusOption the time to add to the current time
 * @returns the current time (locale string)
 */
export function getCurrentTimePlus(
    timezone: string | undefined = "Japan", 
    plusOption: {day?: number, hour?: number, minute?: number, second?: number},
    options?: Intl.DateTimeFormatOptions
): string{
    const now = new Date();

    // whatever about daylight saving time, just use the unsafe time
    const nowPlus = new Date(now.getTime() + (plusOption.day ?? 0) * 24 * 60 * 60 * 1000 + (plusOption.hour ?? 0) * 60 * 60 * 1000 + (plusOption.minute ?? 0) * 60 * 1000 + (plusOption.second ?? 0) * 1000);

    const date = nowPlus.toLocaleString("en-US", {timeZone: timezone, ...options});

    return date;
}

/**
 * Get the time difference between two dates
 * @param date1 
 * @param date2 
 * @returns 
 */
export function getTimeDifference(
    date1: Date,
    date2: Date
): {
    day: number,
    hour: number,
    minute: number,
    second: number
}{
    const diff = date1.getTime() - date2.getTime();

    const diffDate = new Date(Math.abs(diff));

    return {
        day: diffDate.getUTCDate() - 1,
        hour: diffDate.getUTCHours(),
        minute: diffDate.getUTCMinutes(),
        second: diffDate.getUTCSeconds()
    };
}