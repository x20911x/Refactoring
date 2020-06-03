invoice = [
  {
    "customer": "BigCo",
    "performances": [
      {
        "playID": "hamlet",
        "audience": 55
      },
      {
        "playID": "as-like",
        "audience": 35
      },
      {
        "playID": "othello",
        "audience": 40
      }
    ]
  }
]
plays = {
  "hamlet": {"name": "Hamlet", "type": "tragedy"},
  "as-like": {"name": "As You Like It", "type": "comedy"},
  "othello": {"name": "Othello", "type": "tragedy"}
}  



function statement (invoice, plays){
  return renderPlainText(createStatementData (invoice, plays));
}

function createStatementData (invoice, plays){
  const statementData = {};
  statementData.customer = invoice[0].customer
  statementData.performances = invoice[0].performances.map(enrichPerformance);
  statementData.totalAmount = totalAmount(statementData);
  statementData.totalVolumeCredits = totalVolumeCredits(statementData);
  return statementData;


  // function totalAmount(data){
  //   let result = 0;
  //   for (let perf of data.performances) {
  //     result += perf.amount;
  //   }
  //   return result
  // }

  function totalAmount(data) {
    return data.performances
      .reduce((total, p) => total + p.amount, 0);
  }


  // function totalVolumeCredits(data){
  //   let result = 0;
  //   for (let perf of data.performances) {
  //     result += perf.volumeCredits;
  //   }
  //   return result;
  // }
  function totalVolumeCredits(data) {
    return data.performances
      .reduce((total, p) => total + p.volumeCredits, 0);
  }

  function enrichPerformance(aPerformance) {
    const result = Object.assign({}, aPerformance);
    result.play = playFor(result);
    result.amount = amountFor(result);
    result.volumeCredits = volumeCreditsFor(result)
    return result;
  }

  function playFor(aPerformance){
    return plays[aPerformance.playID]
  }


  function amountFor(aPerformance){
    let result = 0;
    switch (aPerformance.play.type) {
    case "tragedy":
      result = 40000;
      if (aPerformance.audience > 30) {
        result += 1000 * (aPerformance.audience - 30);
      }
      break;
    case "comedy":
      result = 30000;
      if (aPerformance.audience > 20) {
        result += 10000 + 500 * (aPerformance.audience - 20);
      }
      result += 300 * aPerformance.audience;
      break;
    default:
        throw new Error(`unknown type: ${aPerformance.play.type}`);
    }
    return result
  }


  function volumeCreditsFor(aPerformance){
    let result = 0;
    // add volume credits
    result += Math.max(aPerformance.audience - 30, 0);
    // add extra credit for every ten comedy attendees
    if ("comedy" === aPerformance.play.type) result += Math.floor(aPerformance.audience / 5);
    return result
  }
  
}



function renderPlainText(data) {
  
  let result = `Statement for ${data.customer}\n`;

  for (let perf of data.performances) {
    // print line for this order
    result += `  ${perf.play.name}: ${usd(perf.amount)} (${perf.audience} seats)\n`;
  }

  result += `Amount owed is ${usd(data.totalAmount)}\n`;
  result += `You earned ${data.totalVolumeCredits} credits\n`;
  return result;

  // function amountFor(aPerformance){
  //   let result = 0;
  //   switch (aPerformance.play.type) {
  //   case "tragedy":
  //     result = 40000;
  //     if (aPerformance.audience > 30) {
  //       result += 1000 * (aPerformance.audience - 30);
  //     }
  //     break;
  //   case "comedy":
  //     result = 30000;
  //     if (aPerformance.audience > 20) {
  //       result += 10000 + 500 * (aPerformance.audience - 20);
  //     }
  //     result += 300 * aPerformance.audience;
  //     break;
  //   default:
  //       throw new Error(`unknown type: ${aPerformance.play.type}`);
  //   }
  //   return result
  // }


  // function playFor(aPerformance){
  //   return plays[aPerformance.playID]
  // }


  // function volumeCreditsFor(aPerformance){
  //   let result = 0;
  //   // add volume credits
  //   result += Math.max(aPerformance.audience - 30, 0);
  //   // add extra credit for every ten comedy attendees
  //   if ("comedy" === aPerformance.play.type) result += Math.floor(aPerformance.audience / 5);
  //   return result
  // }


  function usd(aNumber){
    return new Intl.NumberFormat("en-US",
    { style: "currency", currency: "USD",
      minimumFractionDigits: 2 }).format(aNumber/100)
  }


  // function totalVolumeCredits(){
  //   let result = 0;
  //   for (let perf of data.performances) {
  //     result += perf.volumeCredits;
  //   }
  //   return result;
  // }

  function totalAmount(data) {
    return data.performances
      .reduce((total, p) => total + p.amount, 0);
  }
  // function totalAmount(){
  //   let result = 0;
  //   for (let perf of data.performances) {
  //     result += perf.amount;
  //   }
  //   return result
  // }


  }




// console.log(invoice[0].aPerformanceormances)
// console.log(plays)
console.log(statement(invoice, plays))




