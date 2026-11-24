// Prints the private working set, the peak working set, the private bytes (commit) and the peak
// commit of a process, in bytes. The private working set is the number Task Manager shows as
// "Memory".
// Built with the csc.exe of the .NET Framework, which every Windows has.
using System;
using System.Runtime.InteropServices;

static class WinMem {
  [StructLayout(LayoutKind.Sequential)]
  struct Counters {
    public uint cb;
    public uint PageFaultCount;
    public UIntPtr PeakWorkingSetSize;
    public UIntPtr WorkingSetSize;
    public UIntPtr QuotaPeakPagedPoolUsage;
    public UIntPtr QuotaPagedPoolUsage;
    public UIntPtr QuotaPeakNonPagedPoolUsage;
    public UIntPtr QuotaNonPagedPoolUsage;
    public UIntPtr PagefileUsage;
    public UIntPtr PeakPagefileUsage;
    public UIntPtr PrivateUsage;
    public UIntPtr PrivateWorkingSetSize;
    public ulong SharedCommitUsage;
  }

  [DllImport("kernel32.dll", SetLastError = true)]
  static extern IntPtr OpenProcess(uint access, bool inherit, int pid);

  [DllImport("kernel32.dll")]
  static extern bool CloseHandle(IntPtr handle);

  [DllImport("kernel32.dll", SetLastError = true)]
  static extern bool K32GetProcessMemoryInfo(IntPtr process, ref Counters counters, uint size);

  const uint PROCESS_QUERY_LIMITED_INFORMATION = 0x1000;
  const uint PROCESS_VM_READ = 0x0010;

  static int Main(string[] args) {
    int pid;
    if (args.Length != 1 || !int.TryParse(args[0], out pid)) return 2;
    IntPtr process = OpenProcess(PROCESS_QUERY_LIMITED_INFORMATION | PROCESS_VM_READ, false, pid);
    if (process == IntPtr.Zero) return 1;
    try {
      Counters c = new Counters();
      c.cb = (uint)Marshal.SizeOf(typeof(Counters));
      if (!K32GetProcessMemoryInfo(process, ref c, c.cb)) return 1;
      Console.WriteLine("{0} {1} {2} {3}", c.PrivateWorkingSetSize, c.PeakWorkingSetSize, c.PrivateUsage, c.PeakPagefileUsage);
      return 0;
    } finally {
      CloseHandle(process);
    }
  }
}
