document.querySelector('.kind_of_task').addEventListener('click', kind_of_task_click);
// TNTボタンがクリックされたときの処理
document.getElementById('tntButton').addEventListener('click', () => {
    window.alert('bomb!');
});


// Enterで値を保存する関数
function Entersave() {
    document.getElementById("inputField").addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            const inputText = event.target.value; // 入力内容を取得
            const inputDate = document.getElementById("dateField").value; // 日付を取得

            // 既存の保存データを取得し、配列に保存
            let savedTexts = JSON.parse(localStorage.getItem("savedTexts")) || [];
            if (inputText.trim() !== "") { // 入力が空でないか確認
                // オブジェクトとして保存
                savedTexts.push({ text: inputText, date: inputDate });
                localStorage.setItem("savedTexts", JSON.stringify(savedTexts));  // ローカルストレージに保存
                event.target.value = ""; // 入力フィールドをクリア
                document.getElementById("dateField").value = ""; // 日付フィールドをクリア
            }
            button_savedText();
        }
    });
}

// 保存したテキストを表示する関数
function button_savedText() {
    const buttonContainer = document.getElementById("buttonContainer");
    buttonContainer.innerHTML = "";

    const savedTexts = JSON.parse(localStorage.getItem("savedTexts")) || []; // 入力内容を配列に保存
    const selectedIndex = localStorage.getItem("selectedIndex"); // 選択されたボタンのインデックスを取得

    // 日付順にソート
    savedTexts.sort((a, b) => new Date(a.date) - new Date(b.date));

    // 各テキストをボタンにして追加
    savedTexts.forEach((item, index) => { // itemを使ってタスクと期限を取得
        const button = document.createElement("button");
        //const button_date = document.createElement("button");
        button.innerText = `${item.text} 　(期限: ${item.date})`; // ボタンにタスク名と期限を表示

        // 選択されたボタンにスタイルを適用
        if (index == selectedIndex) {
            button.classList.add("selected");
        }

        // ボタンのクリックイベント
        button.onclick = function() {
            if (button.classList.contains('selected')) {
                button.classList.remove("selected");
                localStorage.removeItem("selectedIndex"); // 選択状態を解除したらローカルストレージもクリア
            } else {
                document.querySelectorAll("#buttonContainer button").forEach(btn => {
                    btn.classList.remove("selected");
                });
                button.classList.add("selected");
        
                // 選択状態のインデックスを保存
                const index = Array.from(document.querySelectorAll("#buttonContainer button")).indexOf(button);
                localStorage.setItem("selectedIndex", index);
            }
        };
        
        buttonContainer.appendChild(button);
    });
}

// Deleteキーを押したとき選択していたボタンを消去する関数
document.addEventListener("keydown", function(event) {
    if (event.key === "Delete") {
        const selectedIndex = localStorage.getItem("selectedIndex");

        if (selectedIndex !== null) {
            let savedTexts = JSON.parse(localStorage.getItem("savedTexts")) || [];
            
            // 選択されたインデックスのデータを削除
            savedTexts.splice(selectedIndex, 1);
            localStorage.setItem("savedTexts", JSON.stringify(savedTexts));
            localStorage.removeItem("selectedIndex");

            // ボタン一覧を更新
            button_savedText();
        }
    }
    // シフトとDeleteキーで全ボタンを削除
    if (event.key === "Delete" && event.shiftKey) {
        localStorage.removeItem("savedTexts"); // ローカルストレージをクリア
        localStorage.removeItem("selectedIndex"); // 選択状態の保存を削除
        button_savedText(); // ボタン一覧を更新
    }
});

document.addEventListener("DOMContentLoaded", () => {
    Entersave();
    button_savedText();
    loadKindOfTask();
    
    const menu = document.getElementById("menu");
    menu.style.display = localStorage.getItem("menuIsOpen") === "true" ? "block" : "none";
});

// メニュー外をクリックしたときの処理
window.addEventListener("click", function(event) {
    const menu = document.getElementById("menu");
    if (!event.target.matches('.menu-button') && !menu.contains(event.target) && menu.style.display === "block") {
        menu.style.display = "none";
        localStorage.setItem("menuIsOpen", false);
    }
});

function toggleMenu() {
    const menu = document.getElementById('menu');
    menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
    localStorage.setItem("menuIsOpen", menu.style.display === 'flex');
}


// kind of taskのテキストボックスの内容をローカルストレージに保存
function saveKindOfTask() {
    const inputs = document.querySelectorAll('#kindOfTaskContainer input[type="text"]');
    const inputValues = Array.from(inputs).map(input => input.value);
    localStorage.setItem('kindOfTask', JSON.stringify(inputValues));
}

// ページ読み込み時にkind of taskのテキストボックスを復元
function loadKindOfTask() {
    const savedTasks = JSON.parse(localStorage.getItem('kindOfTask')) || []; // ⭐ 追加: ローカルストレージから保存データを取得
    const container = document.getElementById('kindOfTaskContainer');
    
    savedTasks.forEach(value => {
        const inputBox = document.createElement('input');
        inputBox.type = 'text';
        inputBox.placeholder = '新しいタスクを入力';
        inputBox.value = value; // ⭐ 追加: テキストボックスに保存された値を設定

        // 入力が変更されたらローカルストレージに再保存
        inputBox.addEventListener('input', saveKindOfTask);
        container.appendChild(inputBox);
    });
}

// kindOfTask クリック時に新しいテキストボックスを追加する処理
function kind_of_task_click(event) {
    const container = document.getElementById('kindOfTaskContainer'); 
    const inputBox = document.createElement('input');
    inputBox.type = 'text';
    inputBox.placeholder = '新しいタスクを入力';
  
    // 入力が変更されたらローカルストレージに保存
    inputBox.addEventListener('input', saveKindOfTask);
    
    // 新しく追加されたテキストボックスにフォーカスを設定
    inputBox.addEventListener('focus', function() {
      setTimeout(function() {
        inputBox.select();  // フォーカス時に内容を選択する
      }, 0);
    });
  
    container.appendChild(inputBox);
    saveKindOfTask();
  }

// 'Ctrl + Delete' でテキストボックスを削除する処理
document.addEventListener('keydown', function (event) {
    // Ctrl + Deleteが押された場合
    if (event.ctrlKey && event.key === 'Delete') {
      const focusedElement = document.activeElement;
  
      // フォーカスされている要素がテキストボックスの場合
      if (focusedElement.tagName === 'INPUT' && focusedElement.type === 'text') {
        focusedElement.remove();  // テキストボックス自体を削除
        saveKindOfTask(); // テキストボックスの削除後に保存を再実行
      }
    }
  });
  
// kindOfTask クリック時に新しいテキストボックスを追加する処理
function kind_of_task_click(event) {
  const container = document.getElementById('kindOfTaskContainer'); 
  const inputBox = document.createElement('input');
  inputBox.type = 'text';
  inputBox.placeholder = '新しいタスクを入力';

  // 入力が変更されたらローカルストレージに保存
  inputBox.addEventListener('input', saveKindOfTask);
  
  // 新しく追加されたテキストボックスにフォーカスを設定
  inputBox.addEventListener('focus', function() {
    setTimeout(function() {
      inputBox.select();  // フォーカス時に内容を選択する
    }, 0);
  });

  container.appendChild(inputBox);
  saveKindOfTask();
}