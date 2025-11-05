export default class UserDto {
    email;
    id;
    isActivated;
    role;
    status;

    constructor(model) {
        this.email = model.email
        this.id = model.id
        this.isActivated = model.isActivated
        this.status = model.status
        this.role = model.role
    }
}