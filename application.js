(function() {
  var db = new Dexie("todos-dexie"), input, ul;
  db.version(1).stores({ todo: '_id' })
  db.open()
    .then(refreshView);

  input = document.querySelector('input');
  ul = document.querySelector('ul');
  document.body.addEventListener('submit', onSubmit);
  document.body.addEventListener('click', onClick);

  function onClick(e) {
    e.preventDefault();
    if (e.target.hasAttribute('id')) {
      db.todo.where('_id').equals(e.target.getAttribute('id')).delete()
        .then(refreshView);
    }
  }

  function onSubmit(e) {
    e.preventDefault();
    db.todo.put({ text: input.value, _id: String(Date.now()) })
      .then(function() {
        input.value = '';
      })
      .then(refreshView);
  }

  function refreshView() {
    return db.todo.toArray().then(renderAllTodos);
  }

  function renderAllTodos(todos) {
    var html = '';
    todos.forEach(function(todo) {
      html += todoToHtml(todo);
    });
    ul.innerHTML = html;
  }

  function todoToHtml(todo) {
    return '<li><button id="'+todo._id+'">delete</button>'+todo.text+'</li>';
  }

}());
