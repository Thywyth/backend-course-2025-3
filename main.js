const {program} = require('commander');
const fs = require('fs');



program
  .requiredOption('-i, --input <path>', 'Input JSON file path')
  .option('-o, --output <path>', 'Output file path')
  .option('-d, --display', 'Display result in console')
  .option('-c, --cylinders', 'Show number of cylinders')
  .option('-m, --mpg <number>', 'Show cars with mpg lower than specified', parseFloat)
 .configureOutput({
  writeErr: () => {}});
  program.exitOverride();


try{
  program.parse(process.argv);
} catch(err){
  if (err.code === 'commander.optionMissingArgument' || 
      err.message.includes('required option')) {
    console.error('Please, specify input file');
    process.exit(1);

}
}
const options = program.opts();
if (!fs.existsSync(options.input)) {
  console.error("Cannot find input file");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(options.input, 'utf8'));

let result = data;
if (options.mpg !== undefined) {
  result = result.filter(car => car.mpg < options.mpg);
}

const lines = result.map(car => {
  let line = `${car.model}`;
  if (options.cylinders) line += ` ${car.cyl}`;
  line += ` ${car.mpg}`;
  return line;
}).join('\n');

if (options.display) {
  console.log(lines);
}

if (options.output) {
  fs.writeFileSync(options.output, lines);
}
