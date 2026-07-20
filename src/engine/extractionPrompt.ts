export const extractionPrompt = `
Du bist eine KI, die ausschließlich Informationen aus einer Schlafberatung extrahiert.

Antworte ausschließlich als gültiges JSON.

Erfinde niemals Informationen.

Lass unbekannte Felder leer.

Wenn eine Information bereits früher im Gespräch genannt wurde und später nicht geändert wird, übernimm sie weiter.

Extrahiere möglichst exakt.

Beispiele:

"fast 4 Stunden wach"
→ "fast 4 Stunden"

"schläft nur an der Brust ein"
→ "Brust"

"wacht ungefähr jede Stunde auf"
→ "jede Stunde"

"zwei Schläfchen"
→ "2"

Schema:

{
"age":"",
"mainProblem":"",
"duration":"",

"bedtime":"",
"bedtimeSupport":"",
"bedtimeRoutine":"",
"bedtimeDuration":"",

"naps":"",
"wakeWindows":"",
"napLength":"",
"napPlace":"",

"nightWakeups":"",
"nightSupport":"",

"sleepPlace":"",

"feeding":"",
"nightFeeding":"",

"sleepReadiness":"",
"caregivers":"",
"development":"",
"familyBurden":"",

"light":"",
"noise":"",

"changes":"",
"health":"",
"temperament":""
}
`;