





export async function getDateObject(d) {

    let dat = await new Date(d);
    let dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "	December"];

    let D = {};
    D.Day = dat.getDate();
    D.DayName = dayNames[(dat.getDay())];
    D.Year = dat.getFullYear();
    D.MonthName = monthNames[(dat.getMonth())];

    return D;
}

export function getDateString(d) {

    let dat = new Date(d);

    let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "	December"];
    let D = "";
    D = dat.getDate() + " " + monthNames[(dat.getMonth())] + " " + dat.getFullYear();
    return D;
}
export function getDayName(d) {
    let dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let dat = new Date(d);
    return dayNames[(dat.getDay())];
}