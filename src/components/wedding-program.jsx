"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/rich-text-editor";
import { Badge } from "@/components/ui/badge";
import { Edit, Save, Eye, FileText, Calendar, Clock } from "lucide-react";

const defaultProgram = `<h1>🕊️ Hääohjelma</h1>

<h3>15.00 – Vieraiden saapuminen ja tervetulomalja</h3>
<p>Vieraat saapuvat juhlatilaan.<br>
Tarjolla kevyt juoma (esim. kuohuviini, mehu).<br>
Mahdollisuus tervehtiä hääparin läheisiä ja tutustua muihin vieraisiin.</p>

<h3>15.30 – Vihkiseremonia</h3>
<p>Hääpari saapuu juhlavasti.<br>
Vihkijän puhe ja valojen vaihto.<br>
Musiikkiesitys tai yhteislaulu.<br>
Seremonian päätös ja onnittelut.</p>

<h3>16.15 – Onnittelut ja valokuvat</h3>
<p>Vieraat onnittelemaan hääparia henkilökohtaisesti.<br>
Ryhmäkuvat hääparin kanssa.<br>
Vapaata seurustelua ennen siirtymistä juhlasaliin.</p>

<h3>17.00 – Illallinen</h3>
<p>Vieraat ohjataan pöytiin.<br>
Alkuruoka tarjoillaan.<br>
<strong>Puheet:</strong> vanhemmat, kaaso, bestman.<br>
Pääruoka tarjoillaan.<br>
Musiikkiesitys tai ohjelmanumero.<br>
Jälkiruoka ja kahvi.</p>

<h3>18.30 – Puheet ja ohjelma</h3>
<p>Puheita ystäviltä ja sukulaisilta.<br>
Leikkejä ja pieniä kilpailuja hääparista.<br>
Yllätysohjelma kaasolta/bestmanilta.</p>

<h3>19.30 – Hääkakun leikkaaminen ja kahvit</h3>
<p>Hääpari leikkaa kakun yhdessä.<br>
Kakkukahvit tarjoillaan.<br>
Mahdollisuus kirjoittaa terveisiä vieraskirjaan.</p>

<h3>20.00 – Häävalssi ja tanssi</h3>
<p>Hääpari tanssii ensimmäisen tanssin.<br>
Vanhempien tanssi ja yhteistanssi kaikille.<br>
Vapaata tanssia orkesterin tai DJ:n johdolla.</p>

<h3>21.30 – Yllätysohjelma</h3>
<p>Video- tai laulutervehdyksiä ystäviltä.<br>
Pienet sketsit, pelit tai muut viihdyttävät ohjelmat.<br>
Mahdollinen yhteislaulu.</p>

<h3>22.30 – Iltapala</h3>
<p>Kevyt buffet-illallinen tai suolainen tarjoilu.<br>
Vieraat voivat jatkaa tanssia ja seurustelua.</p>

<h3>23.30 – Musiikkia ja tanssia</h3>
<p>Ohjelmassa lisää tanssia ja musiikkia.<br>
DJ voi ottaa toivebiisejä vastaan.<br>
Valokuvaaja ikuistaa tunnelmia tanssilattialta.</p>

<h3>00.30 – Kiitossanat ja päätös</h3>
<p>Hääpari kiittää vieraita yhteisestä juhlapäivästä.<br>
<strong>Yhteinen loppuhetki:</strong> kynttilämeri, ilotulitus tai yhteislaulu.<br>
Virallinen ohjelma päättyy, mutta vieraat voivat halutessaan jatkaa seurustelua.</p>`;

export function WeddingProgram({ weddingDate = "2024-07-15", venue = "Suomenlinna, Helsinki" }) {
  const [isEditing, setIsEditing] = useState(false);
  const [programContent, setProgramContent] = useState(defaultProgram);
  const [tempContent, setTempContent] = useState(defaultProgram);
  const [lastSaved, setLastSaved] = useState(new Date());

  const handleSave = () => {
    setProgramContent(tempContent);
    setLastSaved(new Date());
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempContent(programContent);
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fi-FI', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatLastSaved = (date) => {
    return date.toLocaleString('fi-FI', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Hääohjelma</h2>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDate(weddingDate)}
            </div>
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              {venue}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Muokkaa ohjelmaa
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={handleCancel}>
                Peruuta
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Tallenna
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between text-xs text-muted-foreground bg-gray-50 px-3 py-2 rounded-lg">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-xs">
            {isEditing ? "Muokkaustila" : "Katselutila"}
          </Badge>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Viimeksi tallennettu: {formatLastSaved(lastSaved)}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Eye className="h-3 w-3" />
          {isEditing ? "Muokkaa sisältöä alla" : "Valmis ohjelma"}
        </div>
      </div>

      {/* Program Content */}
      <Card className="overflow-hidden pt-0">
        <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50 border-b pt-5">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-pink-600" />
            Hääpäivän ohjelma
          </CardTitle>
          <CardDescription>
            {isEditing 
              ? "Muokkaa hääohjelmaa käyttäen rich text editoria. Voit lisätä emojeja, muotoilla tekstiä ja järjestää aikataulun haluamallasi tavalla."
              : "Kauniisti muotoiltu hääohjelma vieraille. Klikkaa 'Muokkaa ohjelmaa' tehdäksesi muutoksia."
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isEditing ? (
            <div className="p-6">
              <RichTextEditor
                content={tempContent}
                onChange={setTempContent}
                placeholder="Kirjoita hääohjelmasi tähän... Voit käyttää otsikoita, lihavoitua tekstiä, listoja ja emojeja! 💒✨"
              />
            </div>
          ) : (
            <div className="p-6">
              <div 
                className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-headings:font-semibold prose-h1:text-2xl prose-h1:mb-6 prose-h1:text-center prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2 prose-h3:text-pink-700 prose-p:text-gray-700 prose-p:leading-relaxed prose-strong:text-gray-900"
                dangerouslySetInnerHTML={{ __html: programContent }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips Card */}
      {/* {isEditing && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-blue-800">💡 Vinkkejä ohjelman muokkaamiseen</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-blue-700 space-y-2">
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Otsikot:</strong> Käytä H3-otsikoita aikojen merkitsemiseen (esim. "15.00 – Vihkiseremonia")</li>
              <li><strong>Emojit:</strong> Lisää tunnelmaa emojeilla 🕊️ 💒 🥂 🎵 💃</li>
              <li><strong>Lihavointi:</strong> Korosta tärkeitä asioita kuten "Puheet:" tai "Yhteinen loppuhetki:"</li>
              <li><strong>Rivinvaihdot:</strong> Käytä rivinvaihtoja selkeyden vuoksi</li>
              <li><strong>Listat:</strong> Järjestä ohjelmanumerot selkeästi</li>
            </ul>
          </CardContent>
        </Card>
      )} */}
    </div>
  );
}
