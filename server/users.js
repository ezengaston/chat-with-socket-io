const users = [];

export function addUser({ id, name, room }) {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = users.find(
    (user) => user.room === room && user.name === name
  );

  if (existingUser) {
    return {
      error: "Username is taken",
    };
  }

  const user = { id, name, room };

  users.push(user);

  return { user };
}

export function removeUser(id) {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

export function getUser(id) {
  const user = users.find((user) => user.id === id);
  return user;
}

export function getUsersInRoom(room) {
  const user = users.filter((user) => user.room === room);
  return user;
}
