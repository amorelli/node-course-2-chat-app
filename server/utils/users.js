class Users {
  constructor() {
    this.users = [];
  }

  addUser(id, name, room) {
    const user = { id, name, room };
    this.users.push(user);
    return user;
  }

  removeUser(id) {
    const user1 = this.getUser(id);

    if (user1) {
      this.users = this.users.filter(user => user.id !== id);
    }

    return user1;
  }

  getUser(id) {
    return this.users.filter(user => user.id === id)[0];
  }

  getUserList(room) {
    const users = this.users.filter(user => user.room === room);
    const namesArray = users.map(user => user.name);

    return namesArray;
  }

  getRoomList() {
    const rooms = [...new Set(this.users.map(obj => obj.room))];
    return rooms;
  }
}

module.exports = { Users };
