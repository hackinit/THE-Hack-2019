$(document).ready(function() {
    $("#send_message").click(function(a) {
        a.preventDefault();
        var b = !1,
            d = $("#email").val();
			
        if (0 == d.length || "-1" == d.indexOf("@")) {
            var b = !0;
            $("#email").addClass("error_input")
        } else $("#email").removeClass("error_input");
		
        
        0 == b && ($("#send_message").attr({
            disabled: "true",
            value: "Done"
        }), $.post("subscribe.php", $("#subscribe_form").serialize(), function(a) {
            "sent" == a ? ($("#submit").remove(), $("#mail_success").fadeIn(500)) : ($("#mail_fail").fadeIn(500), $("#send_message").removeAttr("disabled").attr("value", "Send The Message"))
        }))
    })
});