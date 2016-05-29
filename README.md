

#bookify

----------

##groep

- Mathias Samyn
- Joey Driessen


> Github can be found on https://github.com/procodingXL/bookify

Dit project maakt gebruik van verschillende componenten waar op gelet moet worden.

 - Om alle services te gebruiken moet er een node server op gezet worden. 
 Simpel weg de `server.js` file starten als volgt `node server.js` is niet voldoende. 
 De volgende modules zijn nodig ( mits ze niet automatisch gevonden worden)
  
  
	 - Firebase `npm install --save firebase`
	 - express `npm install --save express`
	 - body-parser `npm install body-parser`
	 - stripe `npm install stripe`
	 
	 
 -  In de repo is ook een `.sln` file te vinden als deze gestart wordt doormiddel van `Visual studio` zou de server op de goeie poort moeten draaien. Mocht dit niet het geval zijn zorg er dan voor dat je op `localhost:5610` draait. Anders werkt de authorisatie met Facebook niet!

 -  Voor het testen van de stripe API, kan er gebruik gemaakt worden van de volgende testgegevens:
	- Card number: 4242424242424242
	- Date: 04/2017 (of een datum naar keuze)
	- CVS: 123

 -  Vanwege een voor ons onbekend probleem, is het noodzakelijk om de `batarang` extensie in `Google Chrome` geïnstalleerd te hebben (https://chrome.google.com/webstore/detail/angularjs-batarang/ighdmehidhipcmcojjgiloacoafjmpfk). Eenmaal deze extensie geïnstalleerd is, zal de browser opnieuw opgestart moeten worden. Indien je nu naar de webapplicatie gaat, zal je de `tools voor ontwikkelaars` moeten openen en naar het tablad `AngularJS` gaan, waarna je de checkbox `enable`zal moeten aanvinken.

	 





	  
