document.getElementsByTagName('button')[0].addEventListener('click', () => {
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
        button.innerText = `${item.text} (期限: ${item.date})`; // ボタンにタスク名と期限を表示

        // 選択されたボタンにスタイルを適用
        if (index == selectedIndex) {
            button.classList.add("selected");
        }

        button.onclick = function() {
            // すべてのボタンから選択状態を解除
            document.querySelectorAll("#buttonContainer button").forEach(btn => {
                btn.classList.remove("selected");
            });

            // クリックされたボタンに選択状態を適用
            button.classList.toggle("selected");
            if (button.classList.contains('selected')) {
                localStorage.setItem("selectedIndex", index); // 選択状態を保存
            } else {
                localStorage.removeItem("selectedIndex"); // 選択解除
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
