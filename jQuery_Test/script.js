$(document).ready(function () {
    
    // Кэшируем переменные и значения элементов
    var $question = $("#question"),
        $answer = $("#answer"),
        $checkOutSub = $("#checkbox-submitter"),
        $checkRefresher = $("#checkbox-refresher"),
        $checkboxes = $("input[type='checkbox']"),
        $counter = $("#counter"),
        $tab = $("#tab1"),
        $next = $("#next"),
        firstNumber,
        secondNumber,
        question,
        op,
        truth,
        total = 0,
        result = 1,
        operators = [];

    // Если это Internet Explorer 8, то мы добавим текстовые поля над полями ввода, котоые заменят placeholder'ы
    function detectIE() {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf('MSIE ');
        
        if (msie > 0) {
            $("<p class='ask pull-left'>Тут будет вопрос: </p>").insertAfter("#main");
            $("<p class='said pull-right'>Тут вводите ответ: </p>").insertAfter("#main"); 

            $("#next").click(function(){
                $(".ask").remove();
                $(".said").remove();
            });
        }
    }
    
    // Функция формирования случайного числа в диапазоне (min, max)
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    // Функция проверки checkbox'ов
    // Если есть checkbox - checked, тогда добавляем его в массив операторов
    function dumpInArray() {
        operators = [];
        $("input[type='checkbox']:checked").each(function () {
            operators.push($(this).val());
        });
        return operators;
    }

    // Вызываем проверку браузера
    detectIE();
    
    // При клике на "Подтвердить"
    $checkOutSub.click(function () {
        dumpInArray();
        $checkOutSub.attr("disabled", "disabled");
        $checkboxes.prop("disabled", true);
        $("#checkbox-refresher").css("display", "inline");
    });

    // При клике на "Обновить" 
    $checkRefresher.click(function () {
        $checkOutSub.removeAttr("disabled");
        $checkboxes.prop("disabled", false);
        $(this).hide();
    });
    
    // Функция, которая срабатывает при клике на кнопку "Дальше" и ждет ввода числа от пользователя
    function setNewQuestion(){
        dumpInArray();     
        $checkOutSub.attr("disabled", "disabled");
        $checkboxes.prop("disabled", true);
        $checkRefresher.hide();
        firstNumber = getRandomInt(0, 100);
        secondNumber = getRandomInt(0, 100);
        while (firstNumber < secondNumber) {
            firstNumber = getRandomInt(0, 100);
            secondNumber = getRandomInt(0, 100);
        }
        op = operators[getRandomInt(0, operators.length - 1)];
        question = $question;
        question.val(firstNumber.toString() + op + secondNumber.toString() + " =");
    }

    // При клике на "Начать"
    $next.click(function () {
        if(!Number($counter.text())){                // Если значение 0 - тогда сразу вызываем setNewQuestion() - срабатывает 1 раз за тест
            setNewQuestion();
        } else {
            if ($answer.val() > 0) {                 // Если значение больше 0, тогда сравниваем ввод и ответ
                switch (op) {
                    case "+":
                        truth = firstNumber + secondNumber;
                        break;
                    case "-":
                        truth = firstNumber - secondNumber;
                        break;
                    case "*":
                        truth = firstNumber * secondNumber;
                        break;
                    default:
                        truth = Math.round(firstNumber / secondNumber);
                        break;
                }
                if (truth == $answer.val()) {
                    total += 1;
                    $tab.html($tab.html() + "<p id='successp' class='text-success bg-success'>Правильно! Пример с решением: " + firstNumber.toString() + op + secondNumber.toString() + " = " + truth.toString() + "</br> Ваш ответ: " + $answer.val() + " </p>")
                } else {
                    $tab.html($tab.html() + "<p id='successp' class='text-danger bg-danger' >Неправильно! Пример с решением: " + firstNumber.toString() + op + secondNumber.toString() + " = " + truth.toString() + "</br> Ваш ответ: " + $answer.val() + " </p>")
                }
                $checkOutSub.attr("disabled", "disabled");
                $checkboxes.prop("disabled", true);
                $answer.val(null);
                setNewQuestion();
            } else {                                 // Если значение не число, которое больше 0, тогда появляется окно с предупреждением
                alert('Введите целое и положительное значение');
                return false;
            }
        }
        
        $answer.prop("readonly", false);
        $answer.prop("placeholder", "");

        var counter = $counter.text();
        
        // Условие: если номер задачи будет больше 5, то счетчик обнуляется
        if (result == 1 || result < 5) {
            result = +counter + 1;
            $counter.text(result);
            $(this).text("Дальше");
            $(this).attr("class", "btn btn-success pull-right");
        } else {
        // Если прошло 5 задач, то мы обнуляем счетчик задач и выводим количество баллов
            result = 1;
            question = $question.val("0");
            $counter.text("0");
            $(this).text("Начать заново?");
            $(this).attr("class", "btn btn-danger pull-right");
            $checkboxes.prop("disabled", false);
            $answer.prop("readonly", true);
            $checkOutSub.removeAttr("disabled");
            var $p1 = $("<p id='endp' class='text-warning bg-warning' />");
            var $p2 = $("<p class='btn btn-default' />");
            var $p3 = $("<p id='infop' class='text-info bg-info' />");
            var $p4 = $("<p id='infop' class='text-info bg-info' />");
            $p1.text("Спасибо! Тест закончен!");
            $p2.text("Обновить таб");
            $p3.text("Для того, чтобы начать тест заново - обновите таб");
            $p4.text("Ваш результат: " + total + " из 5");
            $tab.append($p1).append($p2).append($p4).append($p3);
            $(this).attr("disabled", "disabled");
			$("html, body").animate({ scrollTop: $(document).height() }, "slow");
            
            // При клике на "Обновить таб"
            $(".btn-default").click(function(){
                $tab.html("");
                $next.removeAttr("disabled");
            });
        }
    });
});
