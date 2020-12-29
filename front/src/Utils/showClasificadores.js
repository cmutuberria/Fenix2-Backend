

export default (clasificadores)=> {
        let text = "";
        if (clasificadores.length==1) {
            text = clasificadores[0].acronimo
        }else{
            clasificadores.forEach((elem, i)=>{
                if (i==0) {
                    text+="("+elem.acronimo+")"                    
                }else  if (i==1) {
                    text+=", "+elem.acronimo                 
                }else{
                    text+=" & "+elem.acronimo                 
                }
            })
        }
        
        return text;

}

