/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function updateSelect(id){
    url = templateUrl($('#'+id).data('url'));
    console.log(url);
    $('#' + id).load(url).prop('disabled', false).removeClass('red-border');

};
function templateUrl(str) {
    return str.replace(/\{\{(.*?)\}\}/g, function (match, token) {
        return $('#' + token).val();
    });
};
function runAjax(url){
    $.get(url, function(data){
       if (data.action==='loading'){
           $('.logo').addClass('rotate');
           setTimeout(function(){
               runAjax((url.indexOf('check')===-1)?url+'/check':url);
           }, 500);
       }
       else
           $('.logo').removeClass('rotate');
    });
}

