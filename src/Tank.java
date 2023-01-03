public class Tank extends Unit implements IAttack {
	public boolean mode; // 시즈모드
	public void attack() {
		System.out.println("탱크공격");
	}
}
