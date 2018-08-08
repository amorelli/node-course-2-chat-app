class Users {
	constructor () {
		this.users = [];
	}
	addUser (id, name, room) {
		var user = {id, name, room};
		this.users.push(user);
		return user;
	}
	removeUser (id) {
		var user = this.getUser(id);

		if (user) {
			this.users = this.users.filter((user) => user.id !== id);
		}

		return user;
	}
	getUser (id) {
		return this.users.filter((user) => user.id === id)[0];
	}
	getUserList (room) {
		var users = this.users.filter((user) => user.room === room);
		var namesArray = users.map((user) => user.name);

		return namesArray;
	}
	getRoomList () {
		var rooms = [...new Set( this.users.map(obj => obj.room))];
		return rooms;
	}
}

module.exports = {Users};

// class Person {
// 	constructor (name) {
// 		this.name = name;
// 	}
// 	getUserDescription  () {
// 		return `Hello, ${this.name}`;
// 	}
// }

// var me = new Person('Adam');
// var description = me.getUserDescription();
// console.log(description);