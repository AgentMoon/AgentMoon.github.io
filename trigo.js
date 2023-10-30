function setangaben() {
  let angaben = [
    {
      name: "a",
      s: document.getElementById("strecke_a").value,
      w: document.getElementById("winkel_a").value,
    },
    {
      name: "b",
      s: document.getElementById("strecke_b").value,
      w: document.getElementById("winkel_b").value,
    },
    {
      name: "c",
      s: document.getElementById("strecke_c").value,
      w: document.getElementById("winkel_c").value,
    },
  ];
  return angaben;
}
function calculate() {
  let i = 0;
  let zähler = count();
  let max = 0;
  let error = false;
  angaben = setangaben();

  while (zähler <= 5 && error == false) {
    max++;

    let point = angaben[i];
    console.log(point);
    if (!point.s && point.w /* Fall ssw; S3 gesucht, s1, s2 gegeben */) {
      let seitcos = {
        winkel: point.w,
        s: [{ sges: point.name }, { s1: "-x" }, { s2: "-x" }],
        pos: [{ sges: i }, { s1: "-y" }, { s2: "-y" }],
      };
      j = 0;
      while (j < 3) {
        if (i == j) {
          /*  console.log(j); */
        } else if (angaben[j].s) {
          if (seitcos.s[1].s1 == "-x") {
            seitcos.s[1].s1 = angaben[j].s;
            seitcos.pos[1].s1 = j;
          } else {
            seitcos.s[2].s2 = angaben[j].s;
            seitcos.pos[2].s2 = j;
          }
        } else {
          console.log("seite " + point.name + " nicht möglich");
        }

        j++;
      }
      if (!(seitcos.s[1].s1 == "-x") && !(seitcos.s[2].s2 == "-x")) {
        sges = seitcos.s[0].sges;
        console.log("ssw");
        console.log("seite " + sges + " ist gesucht.");
        point.s = cossatz(seitcos.s[1].s1, seitcos.s[2].s2, seitcos.winkel);

        document.getElementById(`strecke_${sges}`).value = `${point.s}`;
        document.getElementById(`${sges}_text`).classList.add("is-dirty");
        angaben = setangaben();
      }
    } else if (
      point.s &&
      !point.w /* Fall wws; w3 gesucht, w1, w2, s3 gegeben */
    ) {
      let winkelcos = {
        seite: point.s,
        w: [{ wges: point.name }, { w1: "-x" }, { w2: "-x" }],
        pos: [{ wges: i }, { w1: "-y" }, { w2: "-y" }],
      };
      j = 0;
      while (j < 3) {
        if (i == j) {
        } else if (angaben[j].w) {
          if (winkelcos.w[1].w1 == "-x") {
            winkelcos.w[1].w1 = angaben[j].w;
            winkelcos.pos[1].w1 = j;
          } else {
            winkelcos.w[2].w2 = angaben[j].w;
            winkelcos.pos[2].w2 = j;
          }
        } else {
          console.log("winkel " + point.name + " nicht möglich");
        }
        angaben = setangaben();
        j++;
      }
      if (!(winkelcos.w[1].w1 == "-x") && !(winkelcos.w[2].w2 == "-x")) {
        wges = winkelcos.w[0].wges;
        console.log("wws");
        console.log("winkel " + wges + " ist gesucht");
        point.w = cossatz(
          winkelcos.w[1].w1,
          winkelcos.w[2].w2,
          winkelcos.seite
        );

        document.getElementById(`winkel_${wges}`).value = `${point.w}`;
        document.getElementById(`w${wges}_text`).classList.add("is-dirty");
      }
    }

    if (point.w && point.s /* SINSATZ */) {
      let sinsatz = [
        { w1: point.w },
        { s1: point.s },
        { sw2: "-x" },
        { typ: "-x" },
        { namges: "" },
      ];
      let found = false;
      let k = 0;
      let lsg;
      while (k < 3) {
        console.log(k);

        if (i == k) {
        } else if (
          !(found == true) &&
          (angaben[k].w || angaben[k].s) &&
          !(angaben[k].s && angaben[k].w)
        ) {
          if (angaben[k].w) {
            sinsatz[2].sw2 = angaben[k].w;

            sinsatz[3].typ = "winkel";
          } else {
            sinsatz[2].sw2 = angaben[k].s;
            sinsatz[3].typ = "strecke";
          }
          sinsatz[4].namges = angaben[k].name;

          if (sinsatz[3].typ == "strecke") {
            lsg = sinsatzfct(sinsatz[0].w1, sinsatz[2].sw2, sinsatz[1].s1);
            document.getElementById(
              `winkel_${sinsatz[4].namges}`
            ).value = `${lsg}`;

            document
              .getElementById(`w${sinsatz[4].namges}_text`)
              .classList.add("is-dirty");
          } else if (sinsatz[3].typ == "winkel") {
            lsg = sinsatzfct(sinsatz[1].s1, sinsatz[2].sw2, sinsatz[0].w1);
            document.getElementById(
              `strecke_${sinsatz[4].namges}`
            ).value = `${lsg}`;
            document
              .getElementById(`${sinsatz[4].namges}_text`)
              .classList.add("is-dirty");
          } else {
            console.log("error sinsatz!");
          }

          console.log(
            "sin gefunden für: " + sinsatz[0].w1,
            sinsatz[1].s1,
            sinsatz[2].sw2,
            "(",
            sinsatz[3].typ,
            ")"
          );
          found = true;
        }

        k++;
      }
    }
    angaben = setangaben();
    if (
      angaben[0].s &&
      angaben[1].s &&
      angaben[2].s &&
      !angaben[0].w &&
      !angaben[1].w &&
      !angaben[2].w
    ) {
      let h = 0;
      while (h < 3) {
        s1 = angaben[getright(h)].s;
        s2 = angaben[getright(h + 1)].s;
        s3 = angaben[getright(h + 2)].s;
        console.log(s1, s2, s3);
        wges = angaben[h].name;
        console.log(wges);

        w1 = spezialcos(s1, s2, s3);
        if (isNaN(w1)) {
          document.getElementById("output").innerHTML =
            "berechnung nicht möglich!";
          return;
        } else {
          document.getElementById(`winkel_${wges}`).value = `${w1}`;
          document.getElementById(`w${wges}_text`).classList.add("is-dirty");
  
        }
        
        h++;
      }
    }

    if (error == true) {
      console.log("error");
    }
    zähler = count();
    i++;
    if (i >= 3) {
      i = 0;
    }
    if (max >= 10) {
      error = true;
    }
  }
  /* console.clear(); */
  /* angabe = setangaben();
  angaben.forEach((point) => {
    document.getElementById(`winkel_${point.name}`).value = Math.floor(
      point.w * 1000
    )/1000;
    document.getElementById(`w${point.name}_text`).classList.add("is-dirty");

    document.getElementById(`winkel_${point.name}`).value = Math.floor(
      point.s * 1000
    )/1000;
    document
      .getElementById(`w${point.name}_text`)
      .classList.add("is-dirty");
  }); */
  console.log(angaben);
}

function spezialcos(s1, s2, s3) {
  s1 = s1 * (Math.PI / 180);
  s2 = s2 * (Math.PI / 180);
  s3 = s3 * (Math.PI / 180);

  w =
    Math.acos(
      (Math.cos(s1) - Math.cos(s2) * Math.cos(s3)) /
        (Math.sin(s2) * Math.sin(s3))
    ) *
    (180 / Math.PI);
  console.log("spezialcos", w);
  return w;
}

function getright(h) {
  if (h == 3) {
    take = 0;
  } else if (h == 4) {
    take = 1;
  } else {
    take = h;
  }

  return take;
}

function cossatz(s1, s2, w) {
  console.log(s1, s2, w);
  s1 = s1 * (Math.PI / 180);
  s2 = s2 * (Math.PI / 180);
  w = w * (Math.PI / 180);
  let s;
  s =
    Math.acos(
      Math.cos(s1) * Math.cos(s2) + Math.sin(s1) * Math.sin(s2) * Math.cos(w)
    ) *
    (180 / Math.PI);
  /* s = Math.floor(s * 1000) / 1000; */

  console.log("Log cos", s);
  return s;
}

function sinsatzfct(/* s1 ges */ sins2, sinw1, sinw2) {
  sinw1 = sinw1 * (Math.PI / 180);
  sins2 = sins2 * (Math.PI / 180);
  sinw2 = sinw2 * (Math.PI / 180);
  let sins1;
  sins1 =
    Math.asin((Math.sin(sins2) / Math.sin(sinw2)) * Math.sin(sinw1)) *
    (180 / Math.PI);
  console.log("sinsatz", sins1);
  /* sins1 = Math.floor(sins1 * 1000) / 1000; */

  if (!(sins1 < sins2 && sinw1 < sinw2) || !(sins1 > sins2 && sinw1 > sinw2)) {
    sins1 = 180 - sins1;
  }

  return sins1;
}

function reloadsite() {
  window.location.reload();
}

function checkinput() {
  let zähler = count();
  if (zähler >= 3) {
    document.getElementById("enterbtn").removeAttribute("disabled");
  } else {
    document.getElementById("enterbtn").setAttribute("disabled", true);
  }
}

function count() {
  let count = 0;
  let angaben = [
    {
      name: "a",
      s: document.getElementById("strecke_a").value,
      w: document.getElementById("winkel_a").value,
    },
    {
      name: "b",
      s: document.getElementById("strecke_b").value,
      w: document.getElementById("winkel_b").value,
    },
    {
      name: "c",
      s: document.getElementById("strecke_c").value,
      w: document.getElementById("winkel_c").value,
    },
  ];

  angaben.forEach((point) => {
    if (point.w) {
      count++;
    }
    if (point.s) {
      count++;
    }
  });
  return count;
}
