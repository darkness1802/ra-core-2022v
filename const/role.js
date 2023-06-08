export const ROLE = {
    NORMAL: "NORMAL",
    TEACHER: "TEACHER",
    ADMIN: "ADMIN"
}

export const PERMISSION = {
    NORMAL: ["VIEW", "ENROLL"],
    TEACHER: ["VIEW", "ENROLL", "CREATE_CLASS"],
    ADMIN: ["VIEW", "ENROLL", "CREATE_CLASS", "DELETE_USER"]
}