using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using CommandLine;
using OfficeOpenXml;

namespace Excel2CSV
{
    class Program
    {
        public class Options
        {
            [Option("sheet", Required = true, HelpText = "Sheet to convert")]
            public String Sheet { get; set; }

            [Option("infile", Required = true, Default = false, HelpText = "Input excel file.")]
            public String InFile { get; set; }

            [Option("outfile", Required = true, HelpText = "Output CSV file.")]
            public String OutFile { get; set; }
        }
        static void HandleOptions(Options opt)
        {
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            FileInfo existingFile = new FileInfo(opt.InFile);
            var package = new ExcelPackage(existingFile);
            ExcelWorksheet worksheet = package.Workbook.Worksheets.ToList().Find(s => s.Name == opt.Sheet);

            StringBuilder sb = new StringBuilder();
            for (int row = 1; row <= worksheet.Dimension.Rows; row++)
            {
                for (int col = 1; col <= worksheet.Dimension.Columns; col++)
                {
                    ExcelRange cell = worksheet.Cells[row, col];
                    String valueTxt = cell.Value.ToString();
                    String valueNav = (cell.Hyperlink == null) ? "" : cell.Hyperlink.ToString();

                    sb.Append('"' + valueTxt + '"' + ',' + '"' + valueNav + '"');

                    if (col < worksheet.Dimension.Columns) sb.Append(','); else sb.Append('\n');
                }
            }

            File.WriteAllText(opt.OutFile, sb.ToString());
        }
        static void Main(string[] args)
        {
            Parser.Default.ParseArguments<Options>(args).WithParsed<Options>(opts =>
            {
                HandleOptions(opts);
            }).WithNotParsed<Options>(err =>
            {
                return;
            });
        }
    }
}
