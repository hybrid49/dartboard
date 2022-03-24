<doctype html>
	<html lang="fr">
		<head>
			<title>Page du serveur Node.js</title>
			<meta charset="utf-8" />
			<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
			<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
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
			<h1>Hello {{ name }} !</h1>
			<p>Ceci est une page html</p>
			<div class="row">
				<div class="col-lg-12">
					Dart game
				</div>
			</div>
			<div class="row">
				<div class="col-lg-3">

				</div>
				<div class="col-lg-6">
					<div class="row">
						<div class="col-lg-4 gameMenu">
							<div id="game1" class="SingleGameMenu selected" data-game="1">
								Cricket
							</div>
						</div>
						<div class="col-lg-4 gameMenu">
							<div id="game2" class="SingleGameMenu" data-game="2">
								501
							</div>
						</div>
						<div class="col-lg-4 gameMenu">
							<div id="game3" class="SingleGameMenu" data-game="3">
								301
							</div>
						</div>
					</div>

				</div>
				<div class="col-lg-3">

				</div>

			</div>
		</body>
	</html>