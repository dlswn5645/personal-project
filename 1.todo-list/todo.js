//일정 데이터가 들어 있는 배열 선언
const todos = [];

//새로운 할 일의 id값을 만들어주는 함수
function makeNewId() {
    if (todos.length > 0) {
        const lastIndex = todos.length - 1;
        return todos[lastIndex].id + 1;
    } else {
        return 1;
    }
}

//화면에 추가할 todo-list-item 노드를 생성하는 함수
function makeNewToDoNode(newToDo) {
    const $itemLi = document.createElement('li');
    const $label = document.createElement('label');
    const $div = document.createElement('div');
    const $divMod = document.createElement('div');

    
    //label태그 작업
    $label.classList.add('checkbox');
    $label.innerHTML = `<input type="checkbox"> 
    <span class="text">${newToDo.text}</span>`;
    
    //divMod태그 작업
    $divMod.classList.add('modify');
    $divMod.innerHTML = `<span class="lnr lnr-undo"></span>`;
    
    //div태그 작업
    $div.classList.add('remove');
    $div.innerHTML = `<span class="lnr lnr-cross-circle"></span>`;

    //li태그 작업
    $itemLi.dataset.id = newToDo.id;
    $itemLi.classList.add('todo-list-item');
    $itemLi.appendChild($label);
    $itemLi.appendChild($divMod);
    $itemLi.appendChild($div);

    return $itemLi;
}

//할 일 추가 처리 함수
function insertToDoData() {

    const $todoText = document.getElementById('todo-text');
    if ($todoText.value.trim() === '') {
        $todoText.setAttribute('placeholder', '필수 입력사항입니다.');
        $todoText.style.background = '#F4A0A0';
        $todoText.value = '';
        return;
    } else {
        $todoText.setAttribute('placeholder', '할 일을 입력하세요.');
        $todoText.removeAttribute('style');
    }


    const newToDo = {
        id: makeNewId(),
        text: $todoText.value,
        done: false
    };

    todos.push(newToDo);

    const $todoList = document.querySelector('.todo-list');
    $todoList.appendChild(makeNewToDoNode(newToDo));

    $todoText.value = '';
}

//배열 인덱스 탐색 함수(dataId이용)
function findIndexByDataId(dataId) {

    for (let i = 0; i < todos.length; i++) {
        let todo = todos[i];
        if (dataId === todo.id) {
            return i;
        }
    }
    return null;
}

//체크 박스 이벤트의 세부처리 수행함수
function changeCheckState($checkbox) {
    const $label = $checkbox.parentElement;
    $label.classList.toggle('checked');

    const $li = $label.parentElement;
    const dataId = +$li.dataset.id;

    const foundIndex = findIndexByDataId(dataId);

    todos[foundIndex].done = !todos[foundIndex].done;

    console.log(todos[foundIndex]);

}

//할 일 삭제 처리 수행 함수
function removeToDoData($delSpan) {
    const $delLi = $delSpan.parentElement.parentElement;

    document.querySelector('.todo-list').removeChild($delLi);

    const dataId = +$delLi.dataset.id;
    const foundIndex = findIndexByDataId(dataId);
    if (foundIndex !== null) {
        todos.splice(foundIndex, 1);
    }
    console.log(todos);
}

//수정 모드 진입 이벤트 처리 함수 
function modifyToDoText($modSpan) {

    const $label = $modSpan.parentElement.previousElementSibling;

    const $textSpan = $label.lastElementChild;

    const $modInput = document.createElement('input');
    $modInput.setAttribute('type', 'text');
    $modInput.setAttribute('value', $textSpan.textContent);
    $modInput.classList.add('modify-input');
    $label.replaceChild($modInput, $textSpan);

    const $divModify = $modSpan.parentElement;
    $divModify.innerHTML = '<span class="lnr lnr-checkmark-circle"></span>';
}

//수정 완료 이벤트 처리 함수
function setModifyToDoText($modCheckSpan) {

    const $modInput = $modCheckSpan.parentElement.previousElementSibling.lastElementChild;
    const $label = $modInput.parentElement;
    const $textSpan = document.createElement('span');
    $textSpan.classList.add('text');
    $textSpan.textContent = $modInput.value;

    const dataId = +$label.parentElement.dataset.id;
    const foundIndex = findIndexByDataId(dataId);
    todos[foundIndex].text = $modInput.value;
    console.log(todos[foundIndex]);

    $label.replaceChild($textSpan, $modInput);
    $modCheckSpan.parentElement.innerHTML = '<span class="lnr lnr-undo"></span>';
}

//메인 실행 함수
(function () {

    //할 일 추가 이벤트
    const $addBtn = document.getElementById('add');

    $addBtn.addEventListener('click', function (e) {
        e.preventDefault(); 

        insertToDoData();
    });

    //할 일 완료 체크 이벤트
    const $todoList = document.querySelector('ul.todo-list');

    $todoList.addEventListener('change', function (e) {
        if (!e.target.matches('.todo-list label.checkbox input[type=checkbox]')) {
            return;
        }
        changeCheckState(e.target);
    });

    //할 일 삭제 이벤트
    $todoList.addEventListener('click', function (e) {
        if (!e.target.matches('.todo-list div.remove span')) {
            return;
        }

        removeToDoData(e.target);
    });

    //할 일 수정 이벤트 
    $todoList.addEventListener('click', function (e) {
        if (e.target.matches('.todo-list div.modify span.lnr-undo')) {
            console.log('수정 모드 이벤트 발생!');
            modifyToDoText(e.target);
        } else if (e.target.matches('.todo-list div.modify span.lnr-checkmark-circle')) {
            console.log('수정 확인 이벤트 발생!');
            setModifyToDoText(e.target);
        } else {
            return;
        }
    });


}());