const FieldsValidation = (body) => {
    if (body) {
        for (key in body) {
            if (body[key] === "") {
                return ({ "flag": true, "message": key + " field is required" });
            }
        }
        return ({ "flag": false, "message": "All fields are valid" });
    } else {
        return ({ "flag": false, "message": "Invalid Body" });
    }
}

module.exports = { FieldsValidation };