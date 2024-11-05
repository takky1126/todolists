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

// ページが読み込まれたときの処理
window.onload = function() {
    Entersave();
    button_savedText(); // 保存したテキストをボタンとして表示
};

// ページが読み込まれたときにメニューの状態を復元
document.addEventListener("DOMContentLoaded", () => {
    const menu = document.getElementById("menu");
    const isOpen = localStorage.getItem("menuIsOpen") === "true"; // 保存された状態を取得
    menu.style.display = isOpen ? "block" : "none";
});

function toggleMenu() {
    const menu = document.getElementById("menu");
    const isOpen = menu.style.display === "block";
    menu.style.display = isOpen ? "none" : "block";

    // メニューの開閉状態をローカルストレージに保存
    localStorage.setItem("menuIsOpen", !isOpen);
}

// メニュー外をクリックしたときの処理
window.onclick = function(event) {
    const menu = document.getElementById("menu");
    // メニュー以外の部分がクリックされた場合、かつメニューが開いている場合
    if (!event.target.matches('.menu-button') && !menu.contains(event.target)) {
        // ここでメニューが開いている場合だけ閉じる処理を行う
        if (menu.style.display === "block") {
            menu.style.display = "none";
            // メニューが閉じた状態をローカルストレージに保存
            localStorage.setItem("menuIsOpen", false);
        }
    }
};

// kind of taskの処理
window.onclick = function kind_of_task_click(event) {
    if (event.target.matches('.kind_of_task')) {
        // テキストボックスを作成
        const inputBox = document.createElement('input');
        inputBox.type = 'text_2'; // 入力タイプをテキストに設定
        inputBox.placeholder = '新しいタスクを入力'; // プレースホルダーを設定

        // 新しいテキストボックスを指定のコンテナに追加
        const container = document.getElementById('buttonContainer'); // 追加先のコンテナID
        container.appendChild(inputBox); // コンテナにテキストボックスを追加
    }
};

function toggleMenu() {
    const menu = document.getElementById('menu');
    menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex'; // 'flex'に変更して縦に表示
  }  