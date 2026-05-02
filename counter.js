 /*
     Visitor Counter Application, 03/01/2026, EPastore
*/

async function countHits()
{
    let count = localStorage.getItem('page_view');

    if(count)
    {
        count = Number(count) + 1;
    } else
    {
        count = 1;
    }
    localStorage.setItem('page_view',count);
    document.getElementById("count").innerText = count;
}

window.addEventListener("load",countHits);