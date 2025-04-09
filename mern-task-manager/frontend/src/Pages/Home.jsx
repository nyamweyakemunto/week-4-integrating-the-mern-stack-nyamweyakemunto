import TaskList from '../components/TaskList';

const Home = ({ tasks, loading, setTasks }) => {
  return (
    <div>
      <TaskList tasks={tasks} loading={loading} setTasks={setTasks} />
    </div>
  );
};

export default Home;