$(document).ready(()=>{
    let products = [];
    let products2 = JSON.parse(localStorage.getItem("products"));
    let users = [];
    initials();

    $(document).on('input', '.quantity', function() {
        updateSubtotals();
    });

    function updateSubtotals() {
        var total=0;
        $('.product-item').each(function() {
            var price = parseFloat($(this).find('.product-price').text().substring(1));
            var quantity = parseInt($(this).find('.quantity').val());
            var subtotal = price * quantity;
            total += subtotal;
            $(this).find('.span').text('$' + subtotal);
        });
        $("#cart-total").text("$ "+total)
    }
    $("#show-products").on('click','.remove', function (e) {
        $(this).parents('.product-item').remove();
        products2.push({})
        updateSubtotals();
        console.log();
    });
    function getProductHTML() {
        var prdts = JSON.parse(localStorage.getItem("products"));
        var options = '';
        prdts.map((item)=>{
            options += '<option value="' + item.price + '">' + item.name + '</option>';
        }) ;
        return  `<div class="row product-item">
                            <div class="col-md-5 p-3">
                                <select class="select-product" id="select-product">
                                    <option value="">Select product</option>
                                    ${options}
                                </select>
                                <h6 class="product-price mt-2">$0</h6>
                                
                            </div>
                            
                            <div class="col-md-2">
                                <input class="quantity mt-3" name="quantity$" id="quantity$" type="number" value="0" min="0">
                            </div>
                            <div class="col-md-4 p-3 mt-2">
                                <h6 class="sub-total">total :<span class="span">0</span></h6>
                            </div>
                            <div class="col-md-1 mt-3">
                            <i class="bi bi-x-lg remove" id="remove"></i>
                            
                            </div>
                        </div>`;
        }
    
    
    $("#add-button").on("click",()=>{

        var prdt = products2.shift();
        if (prdt) {
            var productHtml = getProductHTML();
            $('#show-products').append(productHtml);
            
        }

        $('.select-product').on('change', function() {
            var price = parseFloat($(this).val());
            console.log(price);
            $(this).siblings('.product-price').text('$' + price);
            updateSubtotals();
        });
        
    })
    
    $("#add-product").on("submit",(e)=>{
        e.preventDefault()
        addProduct()
        
    });

    $("#order-form").on("submit",(e)=>{
        e.preventDefault();
        var user = $('#select-user :selected').val();

        cart=[];

        $('.product-item').each(function() {
            var name = $(this).find('.select-product option:selected').text();
            var price = parseFloat($(this).find('.select-product').val());
            var qty = parseInt($(this).find('.quantity').val());
            var subtotal = price * qty;

            cart.push({name,price,qty})
        });
        console.log(cart);

        
        var items = cart.filter(item=>item.qty !== 0);
        
        if (user.length!==0 && items.length!==0) {

            localStorage.setItem("user", user);
            localStorage.setItem("cart", JSON.stringify(items));
            window.location="./invoice.html";
        }else{
            Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: ' please fill the form!',
          
            })
        }
    })

    $("#add-user").on("submit",(e)=>{
        e.preventDefault()
        addUser()
        

    });
    function addUser() {

        var name = $("#user-name").val()
        if (name.length!=0 && name.match('^[a-zA-Z]{3,16}$')) {
            var user = {"name":name}
            let usr = JSON.parse(localStorage.getItem("users",users))
            if (usr!==null) {
                users = [user,...usr];
                localStorage.setItem("users",JSON.stringify(users));
                
            }else{
                users.push(user)
                localStorage.setItem("users",JSON.stringify(users))

            }
            
            

            $("#user-name").val('')
            
        }else{
            Swal.fire({
                title: 'Alert',
                text: "Please enter name ",
                icon: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#d33',
                
              });
        }
    }

    function addProduct() {

        var pname = $("#product-name").val()
        var price = $("#product-price").val()
        validateProduct(pname,price).then(()=>{

            let product = {"name":pname,"price":price}
            let prdts = JSON.parse(localStorage.getItem("products"));
            
            products2.push(product)
            $("#product-name").val("")
            $("#product-price").val("")

            if (prdts!==null) {
                products = [product,...prdts];
                localStorage.setItem("products", JSON.stringify(products));
                
            }else{
                products.push(product)
                localStorage.setItem("products", JSON.stringify(products));
                

            }
         

        }).catch(()=>{
            Swal.fire({
                title: 'Alert',
                text: "Please enter name and price",
                icon: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#d33',
                
              })

        })
    }

    function validateProduct(pname,price) {
        return new Promise((resolve, reject) => {
            if (pname.length === 0 || price.length === 0 || !pname.match('^[a-zA-Z]{3,16}$')) {
                console.log(price);
                reject()
            }
            resolve()
        })
    }

    $(document).on("click",".bi-pencil-fill",(e)=>{
        console.log(e.currentTarget.id);
        let id = parseInt(e.currentTarget.id)
        let prdts = JSON.parse(localStorage.getItem("products"))
        Swal.fire({
                    title: 'Update Form',
                    html: `<input type="text" id="prdtname" class="swal2-input" value="${prdts[id].name}" placeholder="Product name">
                    <input type="number" id="prdtprice" class="swal2-input" value="${prdts[id].price}" placeholder="Price">`,
                    confirmButtonText: 'update',
                    focusConfirm: false,
                    preConfirm: () => {
                      const name = Swal.getPopup().querySelector('#prdtname').value
                      const price = Swal.getPopup().querySelector('#prdtprice').value
                      prdts[id].name = name;
                      prdts[id].price = price;
                      let  cart= JSON.parse(localStorage.getItem("products"));
                      cart[id].name = name;
                      cart[id].price = price;
                      localStorage.setItem("products", JSON.stringify(cart));
                      return name;
                    }
                  }).then((result) => {
                    Swal.fire(`
                    ${result.value}
                      updated
                    `).then(()=>{
                        initials();
                    })

                  })


    })

    $(document).on("submit",()=>{
        initials();
    })

    function initials() {
        $(".view-products").empty();
        $(".view-user").empty();
        let prdts = JSON.parse(localStorage.getItem("products"));
        if (prdts!==null) {
            prdts.map((item,index)=>{

                $(".view-products").append(`<div class="card m-3 ">
                <div class="card-body row">
                    <div class="col-md-8">
                        <h4 class="card-title">${item.name}</h4>
                        <h6 class="card-subtitle mb-2 text-muted">$ ${item.price}</h6>
                    </div>
                  <div class="col-md-4">
                    <i class="bi bi-trash" id="trash${index}" data-trash="${index}"></i>
                    <i class="bi bi-pencil-fill" id="${index}" data-edit="${index}"></i>
                </div>
                </div>
              </div>`);
    
              $(`#trash${index}`).click(()=>{
                console.log($(this));
                prdts.splice(index, 1);
                localStorage.setItem("products",JSON.stringify(prdts))
                initials();
                
              })
    
            })
            
        }


       
        let usr = JSON.parse(localStorage.getItem("users",users))
        console.log(usr);
        if (usr!==null) {
            let customers = [...usr]
            customers.map((user,index)=>{

            $(".view-user").append(`<div class="card m-3 ">
            <div class="card-body row">
                <div class="col-md-8">
                    <h4 class="card-title">${user.name}</h4>
                   
                </div>
              <div class="col-md-4">
              <i class="bi bi-x-lg" id="close${index}"></i>
            </div>
            </div>
          </div>`);
          $(`#close${index}`).click(()=>{
            customers.splice(index, 1);
            localStorage.setItem("users",JSON.stringify(customers))
            initials();
          })

        })



        $("#select-user").empty()
        $("#select-user").append(`<option value="">Select user</option>`)


        customers.map((element)=>{
            $("#select-user").append(`<option value="${element.name}">${element.name}</option>`)
        });
            
        }
        
    }
})
