document.addEventListener("DOMContentLoaded", function () {
    const inputField = document.querySelector(".todo-input input");
    const todoList = document.querySelector(".todo-list");
    const filterButtons = document.querySelectorAll(".filters span");
    const clearCompletedBtn = document.querySelector(".clear");
    
    // Add new task
    inputField.addEventListener("keypress", function (event) {
        if (event.key === "Enter" && inputField.value.trim() !== "") {
            addTodo(inputField.value.trim());
            inputField.value = "";
        }
    });

    // Function to add a task
    function addTodo(taskText) {
        const todoItem = document.createElement("div");
        todoItem.classList.add("todo-item");
        todoItem.setAttribute("draggable", "true");

        todoItem.innerHTML = `
            <input type="checkbox">
            <span>${taskText}</span>
            <button class="delete">✖</button>
        `;

        todoList.appendChild(todoItem);
        updateCount();
        enableDragAndDrop();
    }

    // Mark task as completed
    todoList.addEventListener("change", function (event) {
        if (event.target.type === "checkbox") {
            event.target.parentElement.classList.toggle("completed");
            updateCount();
        }
    });

    // Delete task
    todoList.addEventListener("click", function (event) {
        if (event.target.classList.contains("delete")) {
            event.target.parentElement.remove();
            updateCount();
        }
    });

    // Filter tasks
    filterButtons.forEach(button => {
        button.addEventListener("click", function () {
            document.querySelector(".filters .active").classList.remove("active");
            button.classList.add("active");
            filterTasks(button.textContent);
        });
    });

    function filterTasks(filter) {
        const tasks = document.querySelectorAll(".todo-item");
        tasks.forEach(task => {
            switch (filter) {
                case "All":
                    task.style.display = "flex";
                    break;
                case "Active":
                    task.style.display = task.classList.contains("completed") ? "none" : "flex";
                    break;
                case "Completed":
                    task.style.display = task.classList.contains("completed") ? "flex" : "none";
                    break;
            }
        });
    }

    // Clear completed tasks
    clearCompletedBtn.addEventListener("click", function () {
        document.querySelectorAll(".todo-item.completed").forEach(task => task.remove());
        updateCount();
    });

    // Update task count
    function updateCount() {
        const count = document.querySelectorAll(".todo-item:not(.completed)").length;
        document.querySelector(".footer span").textContent = `${count} items left`;
    }

    // Enable drag & drop
    function enableDragAndDrop() {
        const items = document.querySelectorAll(".todo-item");
        let draggedItem = null;

        items.forEach(item => {
            item.addEventListener("dragstart", () => {
                draggedItem = item;
                setTimeout(() => (item.style.display = "none"), 0);
            });

            item.addEventListener("dragend", () => {
                setTimeout(() => {
                    draggedItem.style.display = "flex";
                    draggedItem = null;
                }, 0);
            });

            item.addEventListener("dragover", (e) => e.preventDefault());

            item.addEventListener("drop", function () {
                if (draggedItem !== this) {
                    const allItems = [...todoList.children];
                    const draggedIndex = allItems.indexOf(draggedItem);
                    const targetIndex = allItems.indexOf(this);

                    if (draggedIndex > targetIndex) {
                        todoList.insertBefore(draggedItem, this);
                    } else {
                        todoList.insertBefore(draggedItem, this.nextSibling);
                    }
                }
            });
        });
    }
});
