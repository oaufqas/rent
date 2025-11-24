const t=(r,i="₽")=>(typeof r!="number"&&(r=parseFloat(r)||0),new Intl.NumberFormat("ru-RU",{minimumFractionDigits:2,maximumFractionDigits:2}).format(r)+` ${i}`);export{t as f};
