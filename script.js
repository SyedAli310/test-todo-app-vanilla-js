$(document).ready(() => {
  
  // App initialization logs
  console.log("%c-> Loading...", "color: royalblue; font-size: 14px;");
  console.log(
    "%cApp Initialized Successfully!",
    "color: limegreen; font-size: 14px;"
  );

  // selectors and variables
  const days = ['Sunday😎', 'Monday🧐', 'Tuesday😒', 'Wednesday🤨', 'Thursday😐', 'Friday😁', 'Saturday😎'];
  const mainHeaderHeight = parseFloat((document.querySelector('.main-header').offsetHeight));
  const sortAndFilter = document.querySelector('.sort-and-info');
  const darkModeSwitch = document.querySelector('#dark-mode-switch');
  const allModals = document.querySelectorAll(".modal");

  // setting dyanmic height for sort and filter div and dark mode switch(button) 
  sortAndFilter.style.top = `${mainHeaderHeight}px`;
  darkModeSwitch.style.top = `${mainHeaderHeight+2}px`;

  // function to generate random id for todo
  function generateKey(tokenLen, hyphen, hyphenPos) {
    let string = "abcdefghijklmnopqrstuvwxyz0123456789";
    var token = [];
    if (hyphen == true) {
      for (let i = 0; i < tokenLen; i++) {
        let pos = Math.floor(Math.random() * (35 - 0 + 1) + 0);
        if (hyphenPos == undefined) hyphenPos = 1;
        if (i % hyphenPos == 0) {
          token.push("-");
        }
        token.push(string[pos]);
      }
      token.shift();
    } else if (hyphen == false) {
      for (let i = 0; i < tokenLen; i++) {
        let pos = Math.floor(Math.random() * (35 - 0 + 1) + 0);
        token.push(string[pos]);
      }
    } else {
      token = ["Incorrect", " ", "Arguments", " ", "Provided"];
    }

    token = token.join("").toUpperCase();
    return token;
  }

  // getting all todos from local storage or creating new empty array if not found
  let all__todos = JSON.parse(localStorage.getItem("stored__todos")) || [];
  window.onload = renderTodos();

  // add todo function
  function addTodo(todo, completed, priority) {
    const todo_id = generateKey(8, true, 4).toLowerCase();
    if (!todo || todo.length == 0) {
      alert("Please enter a todo");
      return;
    }
    if (!priority) {
      alert("Please enter a priority");
      return;
    }
    const newTodo = {
      id: todo_id,
      todo,
      completed,
      priority,
      dateAdded: new Date(),
      lastUpdated: new Date(),
    };
    if (newTodo) {
      console.log(newTodo);
      all__todos.push(newTodo);
      localStorage.setItem("stored__todos", JSON.stringify(all__todos));
      $("#todo-input").val("");
      $("#priority-input").val("");
      $(".add-todo-modal").removeClass("active");
      renderTodos();
    }
  }

  // add todo handler
  $("#add-todo").on("submit", (e) => {
    e.preventDefault();
    const todo = $("#todo-input").val().trim();
    const completed = $("#completed-checkbox").is(":checked");
    const priority = $("#priority-input").val().trim();
    addTodo(todo, completed, priority);
  });

  // delete todo function
  function deleteTodo(id) {
    all__todos = all__todos.filter((todo) => todo.id !== id);
    localStorage.setItem("stored__todos", JSON.stringify(all__todos));
    renderTodos();
  }

  // edit todo function
  function editTodo(id) {
    const toBeEdited = all__todos.find((todo) => todo.id === id);
    $("#edit-todo #edit-todo-input").val(toBeEdited.todo);
    $("#edit-todo #edit-priority-input").val(toBeEdited.priority);
    $("#edit-todo #edit-completed-checkbox").prop(
      "checked",
      toBeEdited.completed
    );
    console.log(id);
    $("#edit-todo-submit-btn").attr("data-id", id);
    $(".edit-todo-modal").addClass("active");
    showSliderValUpd();
  }

  // update modal slider value updater
  function showSliderValUpd() {
    $("#prio-selection-realtime-view-upd").text(' '+$("#edit-priority-input").val());
  }

  // add todo modal open handler
  $("#open-add-todo").click(()=>{
    $(".add-todo-modal").addClass("active");
  })

  // sorts dropdown open/close handler
  $('#sort-dropdown-toggle').click(()=>{
    $('.sort-dropdown').toggleClass('active');
    if($('.sort-dropdown').hasClass('active')){
      $('#sort-dropdown-toggle').addClass('active');
    }else{
      $('#sort-dropdown-toggle').removeClass('active');
    }
  })

  // edit todo submit handler
  $("#edit-todo").on("submit", (e) => {
    e.preventDefault();
    const todo = $("#edit-todo-input").val().trim();
    const completed = $("#edit-completed-checkbox").is(":checked");
    const priority = $("#edit-priority-input").val();
    const id = $("#edit-todo-submit-btn").attr("data-id");
    console.log(priority);
    const toBeEdited = all__todos.find((todo) => todo.id === id);
    toBeEdited.todo = todo;
    toBeEdited.completed = completed;
    toBeEdited.priority = priority;
    toBeEdited.lastUpdated = new Date();
    console.log(toBeEdited);
    localStorage.setItem("stored__todos", JSON.stringify(all__todos));
    renderTodos();
    $(".edit-todo-modal").removeClass("active");
  });

  // different sorting handlers
  $("#sort-by-priority").on("click", () => {
    renderTodos(true, false, false);
  });
  $("#sort-by-completed").on("click", () => {
    renderTodos(false, true, false);
  });
  $("#sort-by-oldest").on("click", () => {
    renderTodos(false, false, true);
  });
  $("#sort-by-latest").on("click", () => {
    renderTodos(false, false, false);
  });

  // format date function
  function formatDate(date) {
    if (new Date(date)) {
      const preFormatted = new Date(date).toDateString().split(" ");
      preFormatted.shift();
      preFormatted[1] = preFormatted[1] + ", ";
      return preFormatted.join(" ");
    } else {
      return "Some error occured while formatting the date" + date;
    }
  }

  // function to fill today's date and day name
  $('.today-date').html(
    `
    <span>Happy ${days[new Date().getDay()]}</span>
    <span style='color:royalblue;'>${formatDate(new Date())}</span>
    `)
    

  // Render todos from all__todos - (global variable / local storage)
  function renderTodos(byPriority, byCompleted, byDate) {
    $("#todo-list").html("");
    const totalTodos = all__todos.length;
    const completedTodos = all__todos.filter(
      (todo) => todo.completed === true
    ).length;
    const pendingTodos = all__todos.filter(
      (todo) => todo.completed === false
    ).length;
    $("#total-todos").text(totalTodos);
    $("#total-completed").text(completedTodos);
    $("#total-pending").text(pendingTodos);
    if (all__todos.length > 0) {
      if (byPriority) {
        all__todos.sort((a, b) => a.priority - b.priority);
      } else if (byCompleted) {
        all__todos.sort((a, b) => b.completed - a.completed);
      } else if (byDate) {
        all__todos.sort(
          (a, b) => new Date(a.dateAdded) - new Date(b.dateAdded)
        );
      } else {
        all__todos.sort(
          (a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)
        );
      }
      all__todos.forEach((todo, index) => {
        const todo_li = document.createElement("li");
        todo_li.classList.add("todo-el");
        todo_li.setAttribute("data-id", todo.id);
        todo_li.innerHTML = `
                <div class="todo-el-header">
                    <span class="todo-el-priority">Priority - ${
                      todo.priority
                    }</span>
                    <span class='todo-status' style='color:${
                      todo.completed
                        ? "var(--TEXT_SUCCESS)"
                        : "var(--TEXT_DANGER)"
                    }'>
                      ${todo.completed ? "<ion-icon name='checkmark-done-outline'></ion-icon> Completed" : "<ion-icon name='time-outline'></ion-icon> Pending"} 
                    </span>
                </div>
                <hr style='width:100%;'>
                <div class="todo-el-body">
                  <span>
                    <span style='color:royalblue;'>Updated:</span> 
                    <span style='color:unset !important;'>${formatDate(
                      todo.lastUpdated
                    )} at ${new Date(todo.lastUpdated).toLocaleTimeString(
          navigator.language,
          { hour: "2-digit", minute: "2-digit" }
        )}</span>
                  </span>
                  <h2 class="todo-el-title" style='color:${todo.completed ? "var(--TEXT_SUCCESS)" : "var(--TEXT_DANGER)"}; text-decoration:${todo.completed ? "line-through" : "none"};'>
                    ${todo.todo}
                  </h2>
                </div>
                
                <div class="todo-el-footer">
                  <div class='date-time'>
                    <span>
                      <span style='color:var(--TEXT_SUCCESS);'>Added:</span> 
                      <span style='color:unset !important;'>${formatDate(
                        todo.dateAdded
                      )} at ${new Date(todo.dateAdded).toLocaleTimeString(
          navigator.language,
          { hour: "2-digit", minute: "2-digit" }
        )}</span>
                    </span>
                    
                  </div>
                  <div class='cta-buttons'>
                    <button class='delete-todo-btn' todo-id='${
                      todo.id
                    }' title='Delete ToDo'>
                      <ion-icon name="trash-outline"></ion-icon>
                    </button>
                    <button class='edit-todo-btn' todo-id='${
                      todo.id
                    }' title='Edit ToDo'>
                      <ion-icon name="create-outline"></ion-icon>
                    </button>
                  </div>
                </div>
                `;
        todo.completed
          ? (todo_li.style.boxShadow = "3px 3px 0px var(--TEXT_SUCCESS)")
          : (todo_li.style.boxShadow = "3px 3px 0px var(--TEXT_DANGER)");
        $("#todo-list").append(todo_li);

        $(".delete-todo-btn").click((e) => {
          deleteTodo($(e.target).attr("todo-id"));
        });
        $(".edit-todo-btn").click((e) => {
          editTodo($(e.target).attr("todo-id"));
        });
      });
    } else {
      $("#todo-list").html(`
            <li class="todo-el">
                <span>No Todos added</span>
            </li>
        `);
    }
  }

  // close modal handler
  $(".modal-close-btn").click(() => {
    allModals.forEach((modal) => {
      modal.classList.remove("active");
    });
  });

  // light-dark mode handlers

  // function to switch dark mode
  function switchToDarkMode() {
    $(':root').css('--MAIN_BG', '#000000');
    $(':root').css('--WHITE', '#1b1b1b');
    $(':root').css('--LIGHT_BLACK', '#ffffff');
    $(':root').css('--BLACK', '#ffffff');
  }

  // function to switch light mode
  function switchToLightMode() {
    $(':root').css('--MAIN_BG', '#c0bbbb');
    $(':root').css('--WHITE', '#ffffff');
    $(':root').css('--LIGHT_BLACK', '#1b1b1b');
    $(':root').css('--BLACK', '#000000');
  }

  // function to set switch(button) content
  function setSwitchText(){
    $('#dark-mode-switch').html(`
      ${$("#dark-mode-switch").attr("mode").toUpperCase() === "DARK" 
      ? 
      "<ion-icon name='sunny-outline'></ion-icon>"
      :
      "<ion-icon name='moon-outline'></ion-icon>"
    }
      `);
  }

  // function to check and apply saved mode preference from local storage
  function checkColorMode(){
    const fetchedMode = localStorage.getItem("colorMode");
    if(fetchedMode){
      if(fetchedMode === "dark"){
        $("#dark-mode-switch").attr("mode","dark");
        // console.log('setting dark mode');
        switchToDarkMode();
        setSwitchText();
      }
      else if (fetchedMode === "light"){
        $("#dark-mode-switch").attr("mode","light");
        // console.log('setting light mode');
        switchToLightMode();
        setSwitchText();
      }
    } else {return};
  }

  // checking for saved mode in local storage on page load
  window.onload = setSwitchText();
  window.onload = checkColorMode();

  // light-dark mode switcher
  $("#dark-mode-switch").click(() => {
    if ($("#dark-mode-switch").attr("mode") == "light") {
      $("#dark-mode-switch").attr("mode", "dark");
      switchToDarkMode();
      setSwitchText();
      localStorage.setItem("colorMode", "dark");
    } 
    else if($("#dark-mode-switch").attr("mode") == "dark") {
      $("#dark-mode-switch").attr("mode", "light");
      switchToLightMode();
      setSwitchText();
      localStorage.setItem("colorMode", "light");
    }
  });

});
