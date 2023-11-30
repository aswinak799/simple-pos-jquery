$(document).ready(()=>{
    var products = [...JSON.parse(localStorage.getItem("cart"))];
    console.log(products);
    var customer = localStorage.getItem("user");
    let total = 0;
    var date = new Date()
    var dateArr = String(date).split("GMT");
    $("#date").text(dateArr[0])
    $("#customer").text(customer)
    products.map((element,index)=>{
        // console.log(element);
        $("#tbody").append(`
        <tr>
        <th scope="row">${index+1}</th>
        <td>${element.name}</td>
        <td>$${element.price}</td>
        <td>${element.qty}</td>
        <td>$${element.qty*element.price}</td>

      </tr>`);
      total= total+element.qty*element.price;

    })
    $("#total").text("$"+total)
})

$("#form").submit((event)=>{
    event.preventDefault();
    if ($('input[name="mode"]:checked').val()==="upi" || $('input[name="mode"]:checked').val() === "cash") {
        Swal.fire(
        'Payment Successful!',
        'Payment via '+$('input[name="mode"]:checked').val()+'!',
        'success'
        ).then(()=>{
            window.location.replace("./pos.html")
        })
    }else{
        $(".err").text("Please select cash or upi!")

    }
})