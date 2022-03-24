<doctype html>
	<html lang="fr">
		<head>
			<title>Page du serveur Node.js</title>
			<meta charset="utf-8" />
			<script src="https://code.jquery.com/jquery-3.6.0.js" integrity="sha256-H+K7U5CnXl1h5ywQfKtSj8PCmoN9aaq30gDh27Xc0jk=" crossorigin="anonymous"></script>
			<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
			<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
			<script src="https://cdn.socket.io/4.4.1/socket.io.js"></script>
			<script>
				var socket = io();

				socket.on('dart', function(msg) {
					$('#listeEvent').append('<li>'+msg+'</li>')
				});
			</script>
			<style>
				body{
					background-color: #212121;
					color: white;
					text-align: center;
				}
				.gameMenu{
					padding: 1em;
				}
				.SingleGameMenu{
					background-color: #f44336;
					text-align: center;
					line-height: 9em;
					height: 9em;
				}
				.selected{
					background-color: #673ab7 !important;
				}
			</style>
		</head>
		<body>
			<div class="row">
				<div class="col-lg-5">

				</div>
				<div class="col-lg-2">
					<div class="row">
						<div class="col-lg-12 gameMenu">
							<div id="game1" class="SingleGameMenu selected" data-game="1">
								Cricket
							</div>
						</div>
					</div>

				</div>
				<div class="col-lg-5">

				</div>

			</div>
			<div class="row">
				<div class="col-lg-5">

				</div>
				<div class="col-lg-2">
					<div class="row">
						<div class="col-lg-12 gameMenu">
							<ul id="listeEvent">

							</ul>
						</div>
					</div>

				</div>
				<div class="col-lg-5">

				</div>

			</div>
		</body>
	</html>