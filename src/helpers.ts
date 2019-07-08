export const todoCollectionUrl: string = "http://localhost:4000/todos";

export const todoUrl: (id: string) => string = (id) => {
  return `http://localhost:4000/todos/${id}`;
}
