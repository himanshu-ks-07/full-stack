const statusDiv = document.getElementById('status');
const taskList = document.getElementById('task-list');

async function fetchTasks() {
    statusDiv.innerText = "Loading..."; // Loading state
    try {
        const response = await fetch('http://localhost:5000/api/tasks');
        if (!response.ok) {
            throw new Error(`Server Error: ${response.status}`);
        }
        const tasks = await response.json();
        
        statusDiv.innerText = ""; // Clear loading
        taskList.innerHTML = "";
        
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.textContent = `${task.title} - [${task.completed ? 'Done' : 'Pending'}]`;
            taskList.appendChild(li);
        });
    } catch (error) {
        statusDiv.innerText = `Failed to load tasks: ${error.message}`; // Error state
    }
}

fetchTasks();