#include <iostream>
#include <math.h>

double f(int n);
int factorial(int n);

int main()
{
    double sum = 0;
    for (size_t n = 1; n <= 7; n++)
    {
        sum += f(n);
    }
    std::cout << sum;
    return 0;
}

double f(int n)
{
    return factorial(8) / (factorial(n) * factorial(8 - n) * (pow(2, 8) - 2)) * n / 8 * ceil(0.6 * (8 - n));
}

int factorial(int n)
{
    if (n == 0)
        return 1;
    return n * factorial(n - 1);
}