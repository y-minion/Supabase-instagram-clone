export default function hanldeError(error) {
  if (error) {
    console.log(error);
    throw error;
  }
}
