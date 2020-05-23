var globalTr="";
var spinner = "";
var http = new XMLHttpRequest();
var contenedorAgregar="";
var parsed="";
var date = "";
        window.onload = function ()
        {
            PedirPersonasGet();
            spinner = document.getElementById("loader");
            var cerrar = document.getElementById("cerrar");
            cerrar.onclick=CerrarRecuadro;
            var modificar = document.getElementById("btnModificar");
            modificar.onclick=EditarPersonaPost;
            //se podria cerrar el recuadro una vez hecha la peticion pero como pide que se muestre si el input esta mal
            //modificar.addEventListener("click",CerrarRecuadro);
            var eliminar = document.getElementById("btnEliminar");
            eliminar.onclick=EliminarPersonaPost;
            //eliminar.addEventListener("click",CerrarRecuadro);
        }

        function RealizarPeticionGet(metodo,url,funcion)
        {
            spinner.hidden=false;
            http.onreadystatechange=funcion;
            http.open(metodo,url,true);
            http.send();
        }

        function RealizarPeticionPost(metodo,url,funcion)
        {
            spinner.hidden=false;
            http.onreadystatechange=funcion;
            http.open(metodo,url,true);
            http.setRequestHeader("Content-Type","application/json");


            
            date = new Date();
            var fecha=document.getElementById("fecha");
            var fechaFinal = new Date(fecha.value);

            if (document.getElementById("materia").value.length>=6)
            {
                if (date<fechaFinal)
                {
                    //parsed = fechaFinal.getDate() + "/"+ fechaFinal.getMonth()  +"/" +fechaFinal.getFullYear();
                    //alert (parsed);
                    var data = {nombre:document.getElementById("materia").value,fechaFinal:fechaFinal.value,turno:document.querySelector('input[name="turno"]:checked').value};
                    http.send(JSON.stringify(data));
                }else
                {
                    document.getElementById("fecha").className += "Error";
                    //document.getElementById("materia").className -= "NoError";
                    spinner.hidden=true;
                }
            }else
            {
                document.getElementById("materia").className += "Error";
                //document.getElementById("fecha").className -= "NoError";
                spinner.hidden=true;
            }
            
        }

        function RealizarPeticionPostEliminar(metodo,url,funcion)
        {
            spinner.hidden=false;
            http.onreadystatechange=funcion;
            http.open(metodo,url,true);
            http.setRequestHeader("Content-Type","application/json");
            var data = {id:document.getElementById("id").value};
            http.send(JSON.stringify(data));
        }

        function callback()
        {
            
            if (http.readyState==4 && http.status==200)
            {
                armarGrilla(JSON.parse(http.responseText)); 
                spinner.hidden=true;            
            }
        }

        function respuesta()
        {
            if (http.readyState==4 && http.status==200)
            { 
                Modificar(JSON.parse(http.responseText));
                spinner.hidden=true; 
            }
        }

        function dPersona()
        {
            if (http.readyState==4 && http.status==200)
            {
                Eliminar(JSON.parse(http.responseText));
                spinner.hidden=true; 
            }
        }

        function PedirPersonasGet()
        {
            RealizarPeticionGet("GET","http://localhost:3000/materias",callback);
        }

        function EditarPersonaPost()
        {
            RealizarPeticionPost("POST","http://localhost:3000/editar",respuesta);
        }

        function EliminarPersonaPost()
        {
            RealizarPeticionPostEliminar("POST","http://localhost:3000/eliminar",dPersona);
        }

        
        function armarGrilla(jsonObj)
        {
            var tabla = document.getElementById("tabla");
            
            for(var i = 0;i<jsonObj.length;i++)
            {
                var tr = document.createElement("tr");
                var td = document.createElement("td");
                td.appendChild(document.createTextNode(jsonObj[i].nombre));
                tr.appendChild(td);

                var td2 = document.createElement("td");
                td2.appendChild(document.createTextNode(jsonObj[i].cuatrimestre));
                tr.appendChild(td2);

                var td3 = document.createElement("td");
                td3.appendChild(document.createTextNode(jsonObj[i].fechaFinal));
                tr.appendChild(td3);

                var td4 = document.createElement("td");
                td4.appendChild(document.createTextNode(jsonObj[i].turno));
                tr.appendChild(td4); 

                var td5 = document.createElement("td");
                td5.appendChild(document.createTextNode(jsonObj[i].id));
                td5.hidden=true;
                tr.appendChild(td5);

                tr.addEventListener("dblclick",AbrirRecuadro);
                tabla.appendChild(tr);
            }
           
        }
        

        function AbrirRecuadro(e)
        {
            var recuadro = document.getElementById("contenedorAgregar");
            contenedorAgregar=recuadro;
            recuadro.hidden=false;
            var tr = e.target.parentNode;
            globalTr=tr;
            document.getElementById("materia").value = tr.childNodes[0].innerHTML;
            document.getElementById("numero").value = tr.childNodes[1].innerHTML;

            
            document.getElementById("fecha").value = tr.childNodes[2].innerHTML
            document.getElementById("id").value = tr.childNodes[4].innerHTML;
            
            if (tr.childNodes[3].innerHTML=="Noche")
            {
                document.getElementById("noche").checked=true;
                document.getElementById("mañana").checked=false;
            }else if (tr.childNodes[3].innerHTML=="Mañana")
            {
                document.getElementById("mañana").checked=true;
                document.getElementById("noche").checked=false;
            }
            
        }

        function Modificar(persona)
        {
            //console.log(persona.type);
            if (persona.type="ok")
            {
                globalTr.childNodes[0].innerHTML = document.getElementById("materia").value;
                globalTr.childNodes[2].innerHTML= document.getElementById("fecha").value;
                globalTr.childNodes[3].innerHTML = document.querySelector('input[name="turno"]:checked').value;
                spinner.hidden=true;
            }
            
        }

        function Eliminar(e)
        {
            if (e.type == "ok")
            {
                globalTr.remove();
            }
            spinner.hidden=true;
        }

        function CerrarRecuadro()
        {
            var recuadro = document.getElementById("contenedorAgregar");
            recuadro.hidden=true;
        }

        
