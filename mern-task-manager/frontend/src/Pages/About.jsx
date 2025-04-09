const About = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">About Task Manager</h1>
      <p className="mb-4">
        This is a simple task management application built with the MERN stack
        (MongoDB, Express, React, and Node.js).
      </p>
      <p className="mb-4">
        You can create, read, update, and delete tasks with details like title,
        description, status, and due date.
      </p>
      <p>Version 1.0.0</p>
    </div>
  );
};

export default About;