# Guia rápida de shell scripting

## 1. Shebang:
  `
    #!/bin/bash
    # Regla mnemotécnica para no escribirlo al revés:  el "!" se pronuncia "bang"
  `

  `
    #!/usr/bin/env bash
    # Es más portable (env siempre está en el mismo lugar, bash puede no estar en /bin)
    # Sobre todo si en vez de bash se está tratando de encontrar otro intérprete como
    # python o php, cuyas ubicaciones varían más
  `

## 2. Pasar parámetros:
  `
    #!/bin/bash
    php "$HOME/bin/gotodir/go.php" $*     # Pasa todos los parámetros

    # $@ contiene un array con los argumentos
    # mientras que $* contiene a todos los argumentos en una sola cadena
  `

## 3. Verificar si un parámetro fué pasado o no:
  `
    if [[ -z "$1" ]]                      # -z devuelve true si es un string vacío
      then
        echo "No argument supplied"
        exit 1                            # Abandona el script porque lo
                                          # consideramos un error
    fi
  `

  `
    if [[ $# -eq 0 ]]                     # $# contiene la cantidad de argumentos pasados
      then
        echo "No argument supplied"
        exit 1                            # Abandona el script porque lo
                                          # consideramos un error
    fi
  `

  `
    if [[
          "$1" == "-h" ||
          "$1" == "--help"
       ]]                                 # $1 es igual a -h o a --help ?
      then
        cat doc/help.txt
        exit 0                            # Abandona el script sin considerarlo un error
    fi
  `

  `
    # $@ contiene un array con los argumentos
    # mientras que $* contiene a todos los argumentos en una sola cadena

    for arg in "$@"
    do
        if [[
            "$arg" == "-h" ||
            "$arg" == "--help"
        ]]
        then
            cd "$(dirname "$0")"
            cat deploy.go.mapsentry.com.txt
            exit 0
        fi

        if [[
            "$arg" == "--no-js" ||
            "$arg" == "--install-precompiled-js"
        ]]
        then
            skip_mpn="yes"
            skip_gulp="yes"
        fi

        if [[
            "$arg" == "--install-precompiled-js"
        ]]
        then
            install_precompiled_js="yes"
        fi

    done


    # Luego uso lo que averigüé examinando cada variable creada:

    # if zero
    if [[ -z "$skip_mpn" ]]
        then
            npm install
        else
            echo npm install SKIPPED
    fi

    # if nonzero
    if [[ -n "$install_precompiled_js" ]]
        then
            echo_and_log    echo
            echo_and_log    echo "Installing precompiled app.js from repository"
            echo_and_log    echo "---------------------------------------------"
            echo_and_log    cp ${target_path}/public/js_precompiled/app.js ${target_path}/public/js/app.js
    fi
  `

## 4. Ejecutar en la carpeta del script:
  `
    #!/bin/bash
    cd "$(dirname "$0")"
  `

## 5. Concatenar ejecuciones:
  `
    countdown 10 ; decir "Hola"           # Corre el segundo sin impotar si el primero tuvo exito o falló
    cp a b/b && decir "Archivo copiado"   # Sólo corre el segundo si el primero terminó sin error (AND)
    cp a b/b || decir "ERROR"             # Sólo corre el segundo si el primero terminó con error (OR)
  `

## 6. Saber el resultado de una ejecución (errorlevel, donde 0 es sin error)
  `
    cp a b/b ; echo $?     # $? es el nivel de error.  Si el archivo a o la carpeta b no existen, habrá error
  `

## 7. Especificar el errorlevel de un script
  `
    exit 10     # termina el script con errorlevel 10
    variable=5
    exit $variable  # termina el script con el valor de $variable como errorlevel
                    # 255 como máximo, si se indica mas se calcula el módulo:  $varable % 256
  `

## 8. Usar variable locales (al script)
  `
    variable="valor"
    echo El valor guardado es \"$variable\"
    huboerror=$?
    #no dejar espacio entre el nombre de la variable y el signo igual
    echo "El errorlevel en aquel punto del programa fué: $huboerror"
  `

## 9. Obtener la fecha actual en distintos formatos
  `
    date +%Y%m%d   # imprime en formato YYYYmmdd
    man date       # para ver otros formatos
  `
## 10. Incluir la salida de un subcomando en el comando a correr con backticks:
  `
    echo "La fecha actual es: `\``date +"%-d del %-m de %Y"`\``"
  `
## 11. Generar número random
  `
    echo $RANDOM                         # Random de alrededor de 5 cifras
    echo $RANDOM$RANDOM                  # Random de alrededor de 10 cifras
    echo $(( ( $RANDOM % 10 ) + 1 ))             # Random entre 1 y 10
    echo $(( ( $RANDOM % 100 ) + 5 ))            # Random entre 5 y 104, el 100 acota (entre 0 y 99) y el 5 desplaza (+5)
    echo $(( ( $RANDOM$RANDOM % 10000000 ) ))    # Random de hasta 7 cifras (los ceros del cociente)
  `

## 12. Generar nombre de archivo temporal
  `
    tmpfile="`\``date +"/tmp/processing_%Y%m%d%H%M%S"`\``$RANDOM.txt"
    echo $tmpfile           # Imprime algo como: /tmp/processing_201502162154089780.txt
  `

## 13. Redirigir salida a archivo
  `
    ls > listado.txt    # Sobreescribe listado.txt, si no existe lo crea
    ls >> listado.txt   # Agrega al contenido que ya existia en listado.txt, si no existe lo crea
  `

  `
    ls 1&> out.txt       # Redirije la salida estándar a un archivo
    ls 2&> out.txt       # Redirije la salida de errores a un archivo
  `

  `
    ls 2&>/dev/null     # Suprime los errores
  `

## 14. Redirigir entrada desde archivo
  `
    sort << listado.txt
  `

## 15. Redirigir salida a la entrada de otro comando
  `
    ls | sort
    ls | sort | more     # Se pueden concatenar varios
    find . | less        # less is more
  `

## 16. HEREDOC
  `
    wc << EOF
      wc va a contar las palabras,
      lineas y caracteres de este bloque
      de texto que consiste en un HEREDOC,
      es decir, un bloque que será enviado
      a la entrada estándar del comando wc.
      El bloque termina cuando el delimitador
      indicado en la primer linea (en este
      caso la palabra EOF) aparece solo
      en una línea, sin espacios adelante
      ni atrás, y sin otras palabras.
    EOF
  `

## 17. HEREDOC con redirección de salida
  `
    mysql > tablas.txt << EOF
     use information_schema
     show tables
    EOF
  `

  `
    # La redirección debe indicarse antes que el heredoc
    # No funciona con |.
  `

## 18. Evaluar expresiones con `$(( &lt;expr&gt; ))` y con `\`expr\``
  `
    echo $((2+2))                   # imprime "4"
    echo $((2*3))                   # imprime "6"
    echo $((10/3))                  # imprime "3" (trunca en los enteros)
    echo $((2+2))+$((2*3))          # imprime "4+6"
    echo $(((2+2)+(2*3)))           # imprime "10"
    echo $(( $((2+2))+$((2*3)) ))   # imprime "10"
    echo $(( 10 > 9 ))              # imprime "1" porque es TRUE
    expr 2 + 2                      # imprime "4", expr es compatible con Bourne Shell
    expr 2 * 2                      # Error de sintaxis!  el * tiene que ser escapado pero sólo con expr,
                                    # no es necesario con $((  ))
    expr 2 \* 2                     # imprime "4"
    echo `\``expr 2 + 2`\``                # imprime "4"
    man expr                        # para ver otras expresiones
  `

## 19. Matemática con coma flotante (float)
  `
    val1=10
    val2=3
    resultado=`\``echo "scale=2; $val1/$val2" | bc`\``     # usando bash calculator (bc).
                                                       # scale define el número de lugares decimales
                                                       # que se desean recibir, por defecto 0
    man bc            # para ver formas de uso avanzadas del intérprete matemático
  `

## 20. Bloque IF THEN ELSE básico
  `
    if expr 0; then ls; else ls -la; fi
       # "expr 0" es un comando ejecutable
       #    errorlevel = 0 -> true
       #    errorlevel != 0 -> false
       #  si expr evalua en 0 null el errorlevel devuelto
       #  es 1 (código de error distinto de cero => concluyó sin éxito => falso)
       #  si expr evalua en otro valor el errorlevel devuelto
       #  es 0 (código de error igual a cero, "no error", concluyó con éxito => verdadero)
       #  si el errorlevel es 2 o 3 hubo un error al tratar de evaluar
  `

  `
    if expr 0
    then
      ls
    elif expr 1
    then
      ls -w 50
    else
      ls -la
    fi
       # los ; son intercambiables con Enter
  `

  `
    if expr 0; then
      ls
    else
      ls -la
    fi
  `

## 21. Evaluar condiciones avanzadas en un bloque IF THEN ELSE
  `
    # IF sólo evalúa el errorlevel y no otras condiciones.
    # El comando "test" permite evaluar condiciones avanzadas y devuelve su errorlevel de acuerdo a si son true o false
    if test -n "something"; then echo "La cadena evaluada tiene un largo mayor a 0 (nonzero)."; fi
    if test -z "";          then echo "La cadena evaluada está vacía, es decir que tiene un largo de 0 (zero-lenght)."; fi
  `

  `
    # Forma abreviada de escribir el comando "test":  [ expresión ] 
    if [ -n "something" ]; then echo "La cadena evaluada tiene un largo mayor a 0 (nonzero)."; fi
    if [ -z "" ];          then echo "La cadena evaluada está vacía, es decir que tiene un largo de 0 (zero-lenght)."; fi
  `

  `
    if [ 5 -gt 4 ]; then echo 5 es mayor que 4; fi
        #
        #   Sólo para enteros:
        #     -eq -> equal to
        #     -ne -> not equal to
        #     -gt -> greater than
        #     -lt -> less than
        #     -ge -> greater or equal
        #     -le -> less or equal
        #
        #   Comparación de cadenas:
        #     \>  -> mayor, escapado para que bash no lo considere una redirección de output
        #            no usar con números, los trata como cadenas (55 \> 444 = true)
        #     \<  -> menor, escapado para que bash no lo considere una redirección de input
        #            no usar con números, los trata como cadenas (444 \< 55 = true)
        #     =  -> igual
        #     != -> distinto
        #     -n -> non-zero length
        #     -z -> zero length
  `

  `
    ( EXPRESSION )             # EXPRESSION is true
    ! EXPRESSION               # EXPRESSION is false
    EXPRESSION1 -a EXPRESSION2 # both EXPRESSION1 and EXPRESSION2 are true
    EXPRESSION1 -o EXPRESSION2 # either EXPRESSION1 or EXPRESSION2 is true
    -n STRING                  # the length of STRING is nonzero
    -z STRING                  # the length of STRING is zero
    STRING1 = STRING2          # the strings are equal
    STRING1 != STRING2         # the strings are not equal
    INTEGER1 -eq INTEGER2      # INTEGER1 is equal to INTEGER2
    INTEGER1 -ge INTEGER2      # INTEGER1 is greater than or equal to INTEGER2
    INTEGER1 -gt INTEGER2      # INTEGER1 is greater than INTEGER2
    INTEGER1 -le INTEGER2      # INTEGER1 is less than or equal to INTEGER2
    INTEGER1 -lt INTEGER2      # INTEGER1 is less than INTEGER2
    INTEGER1 -ne INTEGER2      # INTEGER1 is not equal to INTEGER2
    FILE1 -ef FILE2            # FILE1 and FILE2 have the same device and inode numbers
    FILE1 -nt FILE2            # FILE1 is newer (modification date) than FILE2
    FILE1 -ot FILE2            # FILE1 is older than FILE2
                               #
    -e FILE                    # FILE exists
                               #
    -f FILE                    # FILE exists and is a regular file
    -d FILE                    # FILE exists and is a directory
    -l FILE                    # FILE exists and is a symbolic link (same as -L)
                               #
    -s FILE                    # FILE exists and has a size greater than zero
                               #
    -r FILE                    # FILE exists and read permission is granted
    -w FILE                    # FILE exists and write permission is granted
    -x FILE                    # FILE exists and execute (or search) permission is granted
                               #
    -S FILE                    # FILE exists and is a socket
  `

  `
    man test                   # para ver otras posibles evaluaciones
  `

## 22. Descargar y ejecutar un script remoto
  `
    # Usando wget
    bash <(wget -qO- http://miserver.com/miscript.txt)
  `

  `
    # Usando curl
    bash <(curl -s http://miserver.com/miscript.txt)
  `

## 23. Ejecutar un comando en una máquina remota via SSH
  `
    ssh -t user@remote 'ls'
  `

## 24. Eliminar una subcadena del principio o final de otra
  `
    string="hello-world"
    prefix="hell"
    suffix="ld"
  `

  `
    # Queremos obtener: "o-wor"
    foo=${string#"$prefix"}
    foo=${foo%"$suffix"}
    echo "${foo}"   # o  echo $foo
    o-wor
  `

  `
    # Llamando al script con un archivo queremos eliminar la extensión .tar.gz
    table=${1%".tar.gz"}
    echo $table
  `

## 25. Ejecutar otro script desde el script actual
  
Tres posibles maneras:

Para hacer ejecutable a otro script agregar `#!/bin/bash` al principio,
cambiar sus permisos y agregar el path donde se encuentra dicho script a la 
variable de entorno `$PATH` . De ese modo se puede ejecutar como cualquier
comando del sistema.

Otra opción es llamarlo con el comando source (su alias es .) de este modo:
`source /path/to/script;`

La más usada, sin embargo, es simplemente ejecutar `/bin/bash /path/to/script;`.
(esta opción permite pasarle argumentos)


## 26. Ejecutar un comando para varios archivos de una carpeta

  `
    for filename in ./*.js
    do
        echo ${filename}
    done
  `

## 27. Eliminar viejos builds (elimina las primeras subcarpetas de una carpet dejando sólo N carpetas sin borrar)

  `

    #!/bin/bash
     
    # remove-old-builds.sh
     
    # Max Builds to keep
    MAX=3
     
    DIR=$1
    COMMAND="find $DIR -maxdepth 1 ! -path $DIR -type d"
    TOTAL=`$COMMAND | wc -l`
     
    for i in `$COMMAND | awk -F "/" '{print $NF}' | sort -n`; do 
        if [ "$TOTAL" -gt "$MAX"  ]; then
            echo Removing build $i
            rm -rf $DIR/$i
        fi

        (( TOTAL--  ));
    done
  `

## 28. Informar tiempo transcurrido en segundos

`

    job_started=$(date +%s)
    step1_started=$(date +%s)    

    # some commands here

    step1_finished=$(date +%s)
    step2_started=$(date +%s)

    # some commands here
    
    step2_finished=$(date +%s)
    job_finished=$(date +%s)

    echo "Step 1 completed in $(($step1_finished - $step1_started)) seconds.  -  TASK 1 NAME HERE"
    echo "Step 2 completed in $(($step2_finished - $step2_started)) seconds.  -  TASK 2 NAME HERE"
    
    echo "Job completed in $(($deploy_finished - $deploy_started)) seconds."
`

## 29. Echo and log: Mostrar en consola pero también redirigir a archivo

`

    log_file="/var/log/my_log_file.log"
    function echo_and_log() {
        $@ 2>&1 | tee -a ${log_file}
    }

    echo_and_log    echo "Listing directory"
    echo_and_log    ls
    echo_and_log    echo "Done"
`

## 30. Copiar un path completo con Rsync
`
    rsync -a  --exclude=".git" --exclude="node_modules" ${source_root}/ ${target_path}
`
