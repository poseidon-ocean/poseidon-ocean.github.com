<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE HTML >
<html>
  <head>
    <title>My JSP 'index.jsp' starting page</title>
    <meta charset="UTF-8"/>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
  </head>
  <body>
  		<h1>${error_message}</h1>	
 	 	<form action="data/data.jsp" method="post">
			<input name="username" value="keke"/>
			<input name="password" value="keke"/>
			<input type="submit" value="提交"/>
		</form>
  </body>
</html>
