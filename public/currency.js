let currency = {
    local:{
        symbol:"₹",
        rate:75
    },
    localize: function (ele) {
        mystring = elm.innerText;
        data = mystring.match(/\$[\.\d]+/g).map(e => e.replace(/\$/g, ""));
        mystring = mystring.replace(/\$[\.\d\,]+/g, "$");
        mystring = mystring.replace(/\$/g, "###");
        mystring = mystring.split("###");
        output = "";
        for (i = 0; i < mystring.length; i++) {
            output += mystring[i];
            if (data[i] != null) {
                output += currency.local.symbol;
                output += Number(data[i]) * currency.local.rate;
            }
            elm.innerText = output;
        }
    }
}
