<?php
// Description: Wandelt Adressen in Geografische Koordinaten um (mithilfe der Google Geocoding API)
// Use: Importfile "address.txt" --> "output.txt"
// Use: Aufgrund der von Google eingebauten Sperre, muss das Script öfters ausgeführt werden!
// File: "address.txt" --> Pro Zeile eine Adresse
// File: "output.txt" --> Name;Länge;Breite

// FUNKTIONEN
      // Input File einlesen
      function read_file($path){
        $data = file($path);
        for($i=0; $i<count($data); $i++){
          // Leerzeichen vor und am Ende des Strings entfernen
          $data[$i] = trim($data[$i]);
        }
        return $data;
      }
      // Geocoding --> Aus Adressen die Positionen ermitteln
      function geocoding($data){
      // Konvertieren in URL-Format
      $data = rawurlencode($data);
      $url = "http://maps.googleapis.com/maps/api/geocode/json?address=".$data."&sensor=true&language=de";
      // Kommunikation via file_get_contents
      $data = @file_get_contents($url);
      $jsondata = json_decode($data);
      $string = $jsondata->status;
        if($string == "OK"){
          $string = $jsondata->results[0]->geometry->location->lat;
          $string .= ";";
          $string .= $jsondata->results[0]->geometry->location->lng;
          $string = utf8_decode($string);
          return $string;
        }
      return "";
      }


// MAIN PROGRAMM
$address_array=read_file("address.txt");
$anz = count($address_array);
#$anz = 20;

// Koordinaten Array erstellen
for($i=0;$i<$anz;$i++){
  $coordinates[$i]="";
}

// Output Datei laden
if(file_exists("output.txt")){
  $coordinates=read_file("output.txt");
}

  // Koordinaten ermitteln
  for($i=0;$i<$anz;$i++){
    // Wenn noch keine Koordinaten ermittelt sind, dann ermitteln
    if($coordinates[$i]==""){
      $coordinates[$i]=geocoding($address_array[$i]);
    }
    else{
      $test = explode(";", $coordinates[$i]);
      $coordinates[$i] = $test[1].";".$test[2];
    }
  }


// Ausgabe in File
$datei=fopen("output.txt","w+");

for($i=0; $i<$anz; $i++){
  // Zeile in File einfügen
  if($coordinates[$i] == ""){
    fwrite($datei,"\n");
  }
  else{
    fwrite($datei,$address_array[$i].";".$coordinates[$i]."\n");
  }
  echo "$address_array[$i];$coordinates[$i]<br>";
}
// File schließen
fclose($datei);

?>






