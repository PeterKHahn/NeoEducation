@if "%DEBUG%" == "" @echo off
@rem ##########################################################################
@rem
@rem  neoeducation startup script for Windows
@rem
@rem ##########################################################################

@rem Set local scope for the variables with windows NT shell
if "%OS%"=="Windows_NT" setlocal

set DIRNAME=%~dp0
if "%DIRNAME%" == "" set DIRNAME=.
set APP_BASE_NAME=%~n0
set APP_HOME=%DIRNAME%..

@rem Add default JVM options here. You can also use JAVA_OPTS and NEOEDUCATION_OPTS to pass JVM options to this script.
set DEFAULT_JVM_OPTS=

@rem Find java.exe
if defined JAVA_HOME goto findJavaFromJavaHome

set JAVA_EXE=java.exe
%JAVA_EXE% -version >NUL 2>&1
if "%ERRORLEVEL%" == "0" goto init

echo.
echo ERROR: JAVA_HOME is not set and no 'java' command could be found in your PATH.
echo.
echo Please set the JAVA_HOME variable in your environment to match the
echo location of your Java installation.

goto fail

:findJavaFromJavaHome
set JAVA_HOME=%JAVA_HOME:"=%
set JAVA_EXE=%JAVA_HOME%/bin/java.exe

if exist "%JAVA_EXE%" goto init

echo.
echo ERROR: JAVA_HOME is set to an invalid directory: %JAVA_HOME%
echo.
echo Please set the JAVA_HOME variable in your environment to match the
echo location of your Java installation.

goto fail

:init
@rem Get command-line arguments, handling Windows variants

if not "%OS%" == "Windows_NT" goto win9xME_args

:win9xME_args
@rem Slurp the command line arguments.
set CMD_LINE_ARGS=
set _SKIP=2

:win9xME_args_slurp
if "x%~1" == "x" goto execute

set CMD_LINE_ARGS=%*

:execute
@rem Setup the command line

set CLASSPATH=%APP_HOME%\lib\neoeducation-1.0-SNAPSHOT.jar;%APP_HOME%\lib\kotlin-stdlib-jdk8-1.2.31.jar;%APP_HOME%\lib\spark-template-freemarker-2.0.0.jar;%APP_HOME%\lib\spark-core-2.7.2.jar;%APP_HOME%\lib\slf4j-jdk14-1.7.25.jar;%APP_HOME%\lib\guava-23.4-jre.jar;%APP_HOME%\lib\google-api-services-oauth2-v1-rev141-1.23.0.jar;%APP_HOME%\lib\gson-2.7.jar;%APP_HOME%\lib\kotlin-stdlib-jdk7-1.2.31.jar;%APP_HOME%\lib\kotlin-stdlib-1.2.31.jar;%APP_HOME%\lib\slf4j-api-1.7.25.jar;%APP_HOME%\lib\jetty-webapp-9.4.8.v20171121.jar;%APP_HOME%\lib\websocket-server-9.4.8.v20171121.jar;%APP_HOME%\lib\jetty-servlet-9.4.8.v20171121.jar;%APP_HOME%\lib\jetty-security-9.4.8.v20171121.jar;%APP_HOME%\lib\jetty-server-9.4.8.v20171121.jar;%APP_HOME%\lib\websocket-servlet-9.4.8.v20171121.jar;%APP_HOME%\lib\freemarker-2.3.19.jar;%APP_HOME%\lib\google-api-client-1.23.0.jar;%APP_HOME%\lib\google-oauth-client-1.23.0.jar;%APP_HOME%\lib\google-http-client-jackson2-1.23.0.jar;%APP_HOME%\lib\google-http-client-1.23.0.jar;%APP_HOME%\lib\jsr305-1.3.9.jar;%APP_HOME%\lib\error_prone_annotations-2.0.18.jar;%APP_HOME%\lib\j2objc-annotations-1.1.jar;%APP_HOME%\lib\animal-sniffer-annotations-1.14.jar;%APP_HOME%\lib\annotations-13.0.jar;%APP_HOME%\lib\javax.servlet-api-3.1.0.jar;%APP_HOME%\lib\websocket-client-9.4.8.v20171121.jar;%APP_HOME%\lib\jetty-client-9.4.8.v20171121.jar;%APP_HOME%\lib\jetty-http-9.4.8.v20171121.jar;%APP_HOME%\lib\websocket-common-9.4.8.v20171121.jar;%APP_HOME%\lib\jetty-io-9.4.8.v20171121.jar;%APP_HOME%\lib\jetty-xml-9.4.8.v20171121.jar;%APP_HOME%\lib\websocket-api-9.4.8.v20171121.jar;%APP_HOME%\lib\guava-jdk5-17.0.jar;%APP_HOME%\lib\jetty-util-9.4.8.v20171121.jar;%APP_HOME%\lib\jackson-core-2.1.3.jar;%APP_HOME%\lib\httpclient-4.0.1.jar;%APP_HOME%\lib\httpcore-4.0.1.jar;%APP_HOME%\lib\commons-logging-1.1.1.jar;%APP_HOME%\lib\commons-codec-1.3.jar

@rem Execute neoeducation
"%JAVA_EXE%" %DEFAULT_JVM_OPTS% %JAVA_OPTS% %NEOEDUCATION_OPTS%  -classpath "%CLASSPATH%" com.neoeducation.main.MainKt %CMD_LINE_ARGS%

:end
@rem End local scope for the variables with windows NT shell
if "%ERRORLEVEL%"=="0" goto mainEnd

:fail
rem Set variable NEOEDUCATION_EXIT_CONSOLE if you need the _script_ return code instead of
rem the _cmd.exe /c_ return code!
if  not "" == "%NEOEDUCATION_EXIT_CONSOLE%" exit 1
exit /b 1

:mainEnd
if "%OS%"=="Windows_NT" endlocal

:omega
